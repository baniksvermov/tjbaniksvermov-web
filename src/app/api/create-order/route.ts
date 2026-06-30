import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { sendEmail } from '@/lib/email/send'
import { emailNewOrderCustomer, emailNewOrderAdmin } from '@/lib/email/templates'

// In-memory rate limiter: IP → [timestamps]
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hodina

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const hits = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (hits.length >= RATE_LIMIT_MAX) return false
  rateLimitMap.set(ip, [...hits, now])
  return true
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function generateOrderNumber() {
  const d = new Date()
  const yy = d.getFullYear().toString().slice(2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `BS-${yy}${mm}-${rand}`
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Příliš mnoho objednávek. Zkuste to prosím za hodinu.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const {
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
      note,
      potisk_total,
      items,
      _hp, // honeypot
      _t,  // timestamp formuláře
    } = body

    // Honeypot — boti ho vyplní, lidé ne
    if (_hp) {
      return NextResponse.json({ error: 'Neplatný požadavek.' }, { status: 400 })
    }

    // Timing check — minimálně 3 sekundy od načtení formuláře
    if (!_t || Date.now() - Number(_t) < 3000) {
      return NextResponse.json({ error: 'Neplatný požadavek.' }, { status: 400 })
    }

    // Validace povinných polí
    if (!customer_first_name?.trim() || !customer_last_name?.trim() || !customer_email?.trim()) {
      return NextResponse.json({ error: 'Chybí povinné údaje.' }, { status: 400 })
    }

    // Délky polí
    if (customer_first_name.length > 50 || customer_last_name.length > 50) {
      return NextResponse.json({ error: 'Jméno je příliš dlouhé.' }, { status: 400 })
    }
    if (note && note.length > 1000) {
      return NextResponse.json({ error: 'Poznámka je příliš dlouhá (max 1000 znaků).' }, { status: 400 })
    }

    // Formát emailu
    if (!EMAIL_RE.test(customer_email)) {
      return NextResponse.json({ error: 'Neplatný formát e-mailu.' }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Objednávka neobsahuje žádné položky.' }, { status: 400 })
    }

    // Limity položek
    if (items.length > 50) {
      return NextResponse.json({ error: 'Příliš mnoho položek v objednávce.' }, { status: 400 })
    }
    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
        return NextResponse.json({ error: 'Neplatné množství položky.' }, { status: 400 })
      }
    }

    // Anon client pro ověření produktů (respektuje RLS – jen published produkty)
    const supabase = await createClient()
    // Service client pro INSERT objednávek (obchází RLS – veřejný endpoint)
    const serviceSupabase = createServiceClient()

    // Verify product prices server-side
    const productIds = [...new Set<string>(items.map((i: { product_id: string }) => i.product_id))]
    const { data: products } = await supabase
      .from('products')
      .select('id, price, name')
      .in('id', productIds)
      .eq('status', 'published')

    if (!products || products.length !== productIds.length) {
      return NextResponse.json({ error: 'Některý produkt není dostupný.' }, { status: 400 })
    }

    const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]))

    const verifiedItems = items.map((item: {
      product_id: string
      product_name: string
      size: string | null
      color: string | null
      quantity: number
    }) => ({
      ...item,
      unit_price: priceMap[item.product_id],
    }))

    const subtotal = verifiedItems.reduce(
      (s: number, i: { unit_price: number; quantity: number }) => s + i.unit_price * i.quantity,
      0
    )

    const order_number = generateOrderNumber()

    const { data: order, error: orderErr } = await serviceSupabase
      .from('orders')
      .insert({
        order_number,
        customer_first_name,
        customer_last_name,
        customer_email,
        customer_phone,
        note,
        subtotal,
        shipping_cost: 0,
        total: subtotal + (Number(potisk_total) || 0),
        status: 'new',
      })
      .select('id')
      .single()

    if (orderErr || !order) {
      console.error(orderErr)
      return NextResponse.json({ error: 'Chyba při vytváření objednávky.' }, { status: 500 })
    }

    const { error: itemsErr } = await serviceSupabase.from('order_items').insert(
      verifiedItems.map((i: {
        product_id: string
        product_name: string
        size: string | null
        color: string | null
        quantity: number
        unit_price: number
      }) => ({
        order_id: order.id,
        product_id: i.product_id,
        product_name: i.product_name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        unit_price: i.unit_price,
      }))
    )

    if (itemsErr) {
      console.error(itemsErr)
      return NextResponse.json({ error: 'Chyba při ukládání položek.' }, { status: 500 })
    }

    // Odeslání emailů
    const emailData = {
      order_number,
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
      note,
      subtotal,
      total: subtotal + (Number(potisk_total) || 0),
      items: verifiedItems,
    }
    const adminEmail = process.env.ADMIN_EMAIL ?? 'baniksvermov@gmail.com'
    const customerTpl = emailNewOrderCustomer(emailData)
    const adminTpl = emailNewOrderAdmin(emailData)
    await Promise.all([
      sendEmail(customer_email, customerTpl.subject, customerTpl.html),
      sendEmail(adminEmail, adminTpl.subject, adminTpl.html),
    ])

    return NextResponse.json({ order_number })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 })
  }
}
