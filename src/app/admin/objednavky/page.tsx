import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import OrderStatusSelect from './OrderStatusSelect'
import { STATUS_LABELS, STATUS_STYLES } from './constants'

export const dynamic = 'force-dynamic'

export default async function ObjednavkyPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-[Anton] text-3xl uppercase tracking-wide text-[#0a0a0a]">Objednávky</h1>
        <p className="mt-1 text-sm text-gray-500">{orders?.length ?? 0} objednávek celkem</p>
      </div>

      <div className="space-y-4">
        {(!orders || orders.length === 0) && (
          <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
            <p className="font-medium">Zatím žádné objednávky</p>
          </div>
        )}

        {orders?.map((order) => (
          <div key={order.id} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4 border-b border-gray-50">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-[Anton] text-lg tracking-wide text-[#0a0a0a]">{order.order_number}</span>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[order.status] ?? STATUS_STYLES.new}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
                <span className="text-xs text-gray-400">
                  {order.created_at ? format(new Date(order.created_at), 'd. M. yyyy HH:mm', { locale: cs }) : ''}
                </span>
              </div>
              <span className="text-lg font-bold text-[#c8102e]">
                {Number(order.total).toLocaleString('cs-CZ')} Kč
              </span>
            </div>

            <div className="grid grid-cols-1 gap-0 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-50">
              {/* Zákazník */}
              <div className="px-5 py-4 space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Zákazník</p>
                <p className="font-semibold text-[#0a0a0a]">{order.customer_first_name} {order.customer_last_name}</p>
                <a href={`mailto:${order.customer_email}`} className="block text-sm text-[#c8102e] hover:underline">
                  {order.customer_email}
                </a>
                {order.customer_phone && (
                  <a href={`tel:${order.customer_phone}`} className="block text-sm text-gray-600 hover:text-[#c8102e]">
                    {order.customer_phone}
                  </a>
                )}
                {order.note && (
                  <div className="mt-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-800 whitespace-pre-line">
                    {order.note}
                  </div>
                )}
              </div>

              {/* Položky */}
              <div className="px-5 py-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Položky</p>
                <ul className="space-y-2">
                  {(order.items ?? []).map((item: {
                    id: string
                    product_name: string
                    size: string | null
                    color: string | null
                    quantity: number
                    unit_price: number
                  }) => (
                    <li key={item.id} className="flex justify-between gap-2 text-sm">
                      <div>
                        <span className="font-medium text-[#0a0a0a]">{item.product_name}</span>
                        {(item.size || item.color) && (
                          <span className="text-gray-400"> · {[item.size, item.color].filter(Boolean).join(' · ')}</span>
                        )}
                        <span className="text-gray-400"> × {item.quantity}</span>
                      </div>
                      <span className="font-semibold whitespace-nowrap">{(item.unit_price * item.quantity).toLocaleString('cs-CZ')} Kč</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status akce */}
              <div className="px-5 py-4 flex flex-col justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Změnit status</p>
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
