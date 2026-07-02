import { Select } from 'tjbaniksvermov-web'

export function Placeholder() {
  return (
    <Select defaultValue="">
      <option value="">— vyberte typ —</option>
      <option value="match_no_lights">Celé hřiště — přípravný zápas, bez osvětlení</option>
      <option value="training_lights">Celé hřiště — trénink, s osvětlením</option>
      <option value="half_no_lights">Půlka hřiště — trénink, bez osvětlení</option>
    </Select>
  )
}

export function Selected() {
  return (
    <Select defaultValue="training_lights">
      <option value="match_no_lights">Celé hřiště — přípravný zápas, bez osvětlení</option>
      <option value="training_lights">Celé hřiště — trénink, s osvětlením</option>
      <option value="half_no_lights">Půlka hřiště — trénink, bez osvětlení</option>
    </Select>
  )
}
