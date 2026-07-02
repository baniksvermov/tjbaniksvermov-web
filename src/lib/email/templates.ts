export interface OrderData {
  order_number: string
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  customer_phone?: string | null
  note?: string | null
  subtotal: number
  total: number
  items: {
    product_name: string
    size?: string | null
    color?: string | null
    quantity: number
    unit_price: number
  }[]
}

const RED = '#c8102e'
const DARK = '#0a0a0a'

function base(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:${DARK};padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="display:inline-block;background:${RED};color:#fff;font-size:14px;font-weight:700;padding:6px 14px;border-radius:20px;letter-spacing:1px;">TJB</div>
                  <span style="color:#fff;font-size:18px;font-weight:700;margin-left:12px;vertical-align:middle;">TJ Baník Švermov</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:32px;">${body}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f4f4f5;padding:20px 32px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">TJ Baník Švermov · baniksvermov@gmail.com</p>
            <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">Tento e-mail byl odeslán automaticky, neodpovídejte na něj.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function itemsTable(items: OrderData['items'], total?: number) {
  const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0)
  const potiskTotal = total !== undefined ? total - subtotal : 0
  const rows = items.map((i) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:${DARK};">
        ${i.product_name}
        ${i.size || i.color ? `<br/><span style="font-size:12px;color:#6b7280;">${[i.size, i.color].filter(Boolean).join(' · ')}</span>` : ''}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:center;font-size:14px;color:#6b7280;">${i.quantity}×</td>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-size:14px;font-weight:600;color:${DARK};">${(i.unit_price * i.quantity).toLocaleString('cs-CZ')} Kč</td>
    </tr>`).join('')

  const potiskRow = potiskTotal > 0 ? `
    <tr>
      <td colspan="2" style="padding:6px 0;font-size:13px;color:#6b7280;">Potisk dresu</td>
      <td style="padding:6px 0;text-align:right;font-size:13px;color:#6b7280;">+${potiskTotal.toLocaleString('cs-CZ')} Kč</td>
    </tr>` : ''

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <thead>
        <tr>
          <th style="text-align:left;font-size:12px;color:#9ca3af;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e5e7eb;">PRODUKT</th>
          <th style="text-align:center;font-size:12px;color:#9ca3af;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e5e7eb;">KS</th>
          <th style="text-align:right;font-size:12px;color:#9ca3af;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e5e7eb;">CENA</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        ${potiskRow}
        <tr>
          <td colspan="2" style="padding-top:12px;font-size:15px;font-weight:700;color:${DARK};border-top:${potiskTotal > 0 ? '1px solid #e5e7eb' : 'none'};">Celkem</td>
          <td style="padding-top:12px;text-align:right;font-size:18px;font-weight:700;color:${RED};border-top:${potiskTotal > 0 ? '1px solid #e5e7eb' : 'none'};">${(total ?? subtotal).toLocaleString('cs-CZ')} Kč</td>
        </tr>
      </tfoot>
    </table>`
}

function badge(text: string, color: string) {
  return `<span style="display:inline-block;background:${color};color:#fff;font-size:13px;font-weight:700;padding:5px 14px;border-radius:20px;">${text}</span>`
}

// ─── Šablony pro zákazníka ──────────────────────────────────────────────────

export function emailNewOrderCustomer(o: OrderData) {
  const body = `
    <h1 style="margin:0 0 4px;font-size:24px;color:${DARK};">Děkujeme za objednávku!</h1>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Vaše objednávka byla přijata a brzy vás budeme kontaktovat.</p>

    <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#9ca3af;font-weight:600;letter-spacing:.5px;">ČÍSLO OBJEDNÁVKY</p>
      <p style="margin:4px 0 0;font-size:22px;font-weight:700;color:${RED};">${o.order_number}</p>
    </div>

    ${itemsTable(o.items, o.total)}

    ${o.note ? `<div style="margin-top:20px;padding:14px 16px;background:#fffbeb;border-left:3px solid #f59e0b;border-radius:4px;font-size:14px;color:#92400e;"><strong>Poznámka:</strong> ${o.note.replace(/\n/g, '<br/>')}</div>` : ''}

    <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:14px;color:#6b7280;">Budeme vás kontaktovat na <strong>${o.customer_email}</strong>${o.customer_phone ? ` nebo <strong>${o.customer_phone}</strong>` : ''} s dalšími informacemi o platbě a vyzvednutí.</p>
    </div>`
  return { subject: `Objednávka ${o.order_number} přijata — TJ Baník Švermov`, html: base('Objednávka přijata', body) }
}

export function emailConfirmedCustomer(o: OrderData) {
  const body = `
    ${badge('Potvrzeno', '#2563eb')}
    <h1 style="margin:12px 0 4px;font-size:22px;color:${DARK};">Objednávka potvrzena</h1>
    <p style="margin:0 0 24px;color:#6b7280;">Vaši objednávku ${o.order_number} jsme potvrdili a zpracováváme ji.</p>
    ${itemsTable(o.items, o.total)}
    <p style="margin-top:20px;font-size:14px;color:#6b7280;">Jakmile bude objednávka připravena k vyzvednutí, dáme vám vědět.</p>`
  return { subject: `Objednávka ${o.order_number} potvrzena`, html: base('Objednávka potvrzena', body) }
}

export function emailReadyCustomer(o: OrderData) {
  const body = `
    ${badge('Připraveno k vyzvednutí', '#7c3aed')}
    <h1 style="margin:12px 0 4px;font-size:22px;color:${DARK};">Vaše objednávka je připravena!</h1>
    <p style="margin:0 0 24px;color:#6b7280;">Objednávka ${o.order_number} na vás čeká. Přijďte si pro ni na naše hřiště.</p>
    ${itemsTable(o.items, o.total)}
    <div style="margin-top:24px;background:#f0fdf4;border-radius:8px;padding:16px 20px;">
      <p style="margin:0;font-size:14px;color:#166534;font-weight:600;">📍 TJ Baník Švermov, Kladno-Švermov</p>
      <p style="margin:6px 0 0;font-size:13px;color:#166534;">V případě dotazů nás kontaktujte na baniksvermov@gmail.com</p>
    </div>`
  return { subject: `Objednávka ${o.order_number} je připravena k vyzvednutí`, html: base('Připraveno k vyzvednutí', body) }
}

export function emailPickedUpCustomer(o: OrderData) {
  const body = `
    ${badge('Vyzvednuto', '#16a34a')}
    <h1 style="margin:12px 0 4px;font-size:22px;color:${DARK};">Děkujeme za nákup!</h1>
    <p style="margin:0 0 24px;color:#6b7280;">Objednávka ${o.order_number} byla úspěšně vyzvednuta. Doufáme, že budete s nákupem spokojeni!</p>
    ${itemsTable(o.items, o.total)}
    <p style="margin-top:20px;font-size:14px;color:#6b7280;">Uvidíme se na hřišti! ⚽</p>`
  return { subject: `Děkujeme za nákup — TJ Baník Švermov`, html: base('Děkujeme za nákup', body) }
}

export function emailCancelledCustomer(o: OrderData) {
  const body = `
    ${badge('Zrušeno', '#dc2626')}
    <h1 style="margin:12px 0 4px;font-size:22px;color:${DARK};">Objednávka zrušena</h1>
    <p style="margin:0 0 24px;color:#6b7280;">Vaše objednávka ${o.order_number} byla zrušena.</p>
    ${itemsTable(o.items, o.total)}
    <p style="margin-top:20px;font-size:14px;color:#6b7280;">Pokud máte dotazy, kontaktujte nás na baniksvermov@gmail.com</p>`
  return { subject: `Objednávka ${o.order_number} zrušena`, html: base('Objednávka zrušena', body) }
}

// ─── Notifikace pro admina (nová přihláška „Chci hrát za Baník") ───────────

export interface NaborData {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthYear?: string | null
  team?: string | null
  note?: string | null
}

export function emailNewNaborAdmin(n: NaborData) {
  const body = `
    <h1 style="margin:0 0 4px;font-size:22px;color:${DARK};">Chci hrát za Baník ⚽</h1>
    <p style="margin:0 0 24px;color:#6b7280;">Nová přihláška z webu.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#6b7280;width:140px;">Jméno</td>
        <td style="padding:6px 0;font-size:14px;font-weight:600;color:${DARK};">${n.firstName} ${n.lastName}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#6b7280;">E-mail</td>
        <td style="padding:6px 0;font-size:14px;"><a href="mailto:${n.email}" style="color:${RED};text-decoration:none;">${n.email}</a></td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#6b7280;">Telefon</td>
        <td style="padding:6px 0;font-size:14px;"><a href="tel:${n.phone}" style="color:${DARK};text-decoration:none;">${n.phone}</a></td>
      </tr>
      ${n.birthYear ? `<tr><td style="padding:6px 0;font-size:14px;color:#6b7280;">Rok narození</td><td style="padding:6px 0;font-size:14px;color:${DARK};">${n.birthYear}</td></tr>` : ''}
      ${n.team ? `<tr><td style="padding:10px 0 0;font-size:14px;color:#6b7280;vertical-align:top;">Preferovaný tým</td><td style="padding:10px 0 0;">${badge(n.team, RED)}</td></tr>` : ''}
    </table>

    ${n.note ? `<div style="padding:14px 16px;background:#fffbeb;border-left:3px solid #f59e0b;border-radius:4px;font-size:14px;color:#92400e;white-space:pre-line;margin-bottom:20px;"><strong>Poznámka:</strong><br/>${n.note}</div>` : ''}

    <div style="padding:16px 20px;background:#f0fdf4;border-radius:8px;">
      <p style="margin:0;font-size:14px;color:#166534;font-weight:600;">📞 Ozvěte se zájemci co nejdřív, ideálně do 48 hodin.</p>
    </div>`
  return { subject: `⚽ Nová přihláška — ${n.firstName} ${n.lastName}`, html: base('Nová přihláška', body) }
}

// ─── Notifikace pro admina (nová objednávka) ────────────────────────────────

export function emailNewOrderAdmin(o: OrderData) {
  const body = `
    <h1 style="margin:0 0 4px;font-size:22px;color:${DARK};">Nová objednávka!</h1>
    <p style="margin:0 0 24px;color:#6b7280;">Právě přišla nová objednávka z e-shopu.</p>

    <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;color:#9ca3af;font-weight:600;">ČÍSLO OBJEDNÁVKY</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:${RED};">${o.order_number}</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#6b7280;width:120px;">Zákazník</td>
        <td style="padding:6px 0;font-size:14px;font-weight:600;color:${DARK};">${o.customer_first_name} ${o.customer_last_name}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#6b7280;">E-mail</td>
        <td style="padding:6px 0;font-size:14px;color:${RED};"><a href="mailto:${o.customer_email}" style="color:${RED};">${o.customer_email}</a></td>
      </tr>
      ${o.customer_phone ? `<tr><td style="padding:6px 0;font-size:14px;color:#6b7280;">Telefon</td><td style="padding:6px 0;font-size:14px;color:${DARK};"><a href="tel:${o.customer_phone}" style="color:${DARK};">${o.customer_phone}</a></td></tr>` : ''}
    </table>

    ${itemsTable(o.items, o.total)}

    ${o.note ? `<div style="margin-top:20px;padding:14px 16px;background:#fffbeb;border-left:3px solid #f59e0b;border-radius:4px;font-size:14px;color:#92400e;white-space:pre-line;"><strong>Poznámka / Potisk:</strong><br/>${o.note}</div>` : ''}

    <div style="margin-top:24px;text-align:center;">
      <a href="https://tjbaniksvermov-web.vercel.app/admin/objednavky" style="display:inline-block;background:${RED};color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">Otevřít v administraci →</a>
    </div>`
  return { subject: `🛒 Nová objednávka ${o.order_number} — ${o.customer_first_name} ${o.customer_last_name}`, html: base('Nová objednávka', body) }
}
