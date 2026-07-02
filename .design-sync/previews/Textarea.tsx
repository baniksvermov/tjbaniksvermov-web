import { Textarea } from 'tjbaniksvermov-web'

export function Empty() {
  return <Textarea rows={3} placeholder="Dodatečné informace k objednávce…" />
}

export function Filled() {
  return (
    <Textarea
      rows={4}
      defaultValue={'Prosím o rezervaci hřiště na sobotu dopoledne.\nDěkujeme.'}
    />
  )
}
