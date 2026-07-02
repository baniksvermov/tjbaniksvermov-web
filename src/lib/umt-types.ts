export const BOOKING_TYPE_LABELS: Record<string, string> = {
  match_no_lights: 'Celé hřiště · zápas, bez osvětlení',
  match_lights: 'Celé hřiště · zápas, s osvětlením',
  training_no_lights: 'Celé hřiště · trénink, bez osvětlení',
  training_lights: 'Celé hřiště · trénink, s osvětlením',
  half_no_lights: 'Půlka hřiště · bez osvětlení',
  half_lights: 'Půlka hřiště · s osvětlením',
}

// Půlka hřiště zabírá jen poloviční kapacitu — druhá půlka jde pronajmout ve stejný čas.
export function bookingCapacity(bookingType: string | null | undefined) {
  return bookingType?.startsWith('half_') ? 0.5 : 1
}
