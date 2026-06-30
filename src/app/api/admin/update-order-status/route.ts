import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send'
import {
  emailConfirmedCustomer,
  emailReadyCustomer,
  emailPickedUpCustomer,
  emailCancelledCustomer,
  type OrderData,
} from '@/lib/email/templates'

const STATUS_EMAIL: Record<string, (o: OrderData) => { subject: string; html: string }> = {
  confirmed: emailConfirmedCustomer,
  ready: emailReadyCustomer,
  picked_up: emailPickedUpCustomer,
  cancelled: emailCancelledCustomer,
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 })

  const { order_id, status } = await req.json()
  if (!order_id || !status) return NextResponse.json({ error: 'Chybí parametry' }, { status: 400 })

  const validStatuses = ['new', 'confirmed', 'ready', 'picked_up', 'cancelled']
  if (!validStatuses.includes(status)) return NextResponse.json({ error: 'Neplatný status' }, { status: 400 })

  const { error: updateErr } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', order_id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  // Načteme objednávku pro email
  if (STATUS_EMAIL[status]) {
    const { data: order } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', order_id)
      .single()

    if (order) {
      const emailData: OrderData = {
        order_number: order.order_number,
        customer_first_name: order.customer_first_name,
        customer_last_name: order.customer_last_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        note: order.note,
        subtotal: order.subtotal,
        total: order.total,
        items: (order.items ?? []).map((i: {
          product_name: string
          size: string | null
          color: string | null
          quantity: number
          unit_price: number
        }) => ({
          product_name: i.product_name,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          unit_price: i.unit_price,
        })),
      }
      const tpl = STATUS_EMAIL[status](emailData)
      await sendEmail(order.customer_email, tpl.subject, tpl.html)
    }
  }

  return NextResponse.json({ ok: true })
}
