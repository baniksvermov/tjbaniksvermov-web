import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function generateOrderNumber() {
  const d = new Date()
  const yy = d.getFullYear().toString().slice(2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `BS-${yy}${mm}-${rand}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
      note,
      items,
    } = body

    if (!customer_first_name || !customer_last_name || !customer_email) {
      return NextResponse.json({ error: 'Chybí povinné údaje.' }, { status: 400 })
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Objednávka neobsahuje žádné položky.' }, { status: 400 })
    }

    const supabase = await createClient()

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

    const { data: order, error: orderErr } = await supabase
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
        total: subtotal,
        status: 'new',
      })
      .select('id')
      .single()

    if (orderErr || !order) {
      console.error(orderErr)
      return NextResponse.json({ error: 'Chyba při vytváření objednávky.' }, { status: 500 })
    }

    const { error: itemsErr } = await supabase.from('order_items').insert(
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

    return NextResponse.json({ order_number })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 })
  }
}
