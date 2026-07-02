import { Input } from 'tjbaniksvermov-web'

export function Empty() {
  return <Input placeholder="Jan" />
}

export function Filled() {
  return <Input defaultValue="Jan Novák" />
}

export function Types() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 280 }}>
      <Input type="email" placeholder="jan@email.cz" />
      <Input type="tel" placeholder="+420 600 000 000" />
      <Input type="date" defaultValue="2026-08-15" />
    </div>
  )
}

export function Disabled() {
  return <Input disabled defaultValue="Needitovatelné pole" />
}
