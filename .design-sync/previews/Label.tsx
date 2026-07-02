import { Label, Input } from 'tjbaniksvermov-web'

export function Default() {
  return <Label>Jméno</Label>
}

export function Required() {
  return (
    <Label>
      Email <span style={{ color: '#ef4444' }}>*</span>
    </Label>
  )
}

export function WithField() {
  return (
    <div style={{ maxWidth: 240 }}>
      <Label>Telefon</Label>
      <Input type="tel" placeholder="+420 600 000 000" />
    </div>
  )
}
