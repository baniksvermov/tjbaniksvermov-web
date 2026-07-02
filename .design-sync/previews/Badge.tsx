import { Badge } from 'tjbaniksvermov-web'

export function Solid() {
  return <Badge>Novinky</Badge>
}

export function Soft() {
  return <Badge variant="soft">Novinky</Badge>
}

export function CustomColors() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge color="#1d4ed8">Zápasy</Badge>
      <Badge color="#15803d">Turnaje</Badge>
      <Badge color="#c8102e">Klub</Badge>
    </div>
  )
}
