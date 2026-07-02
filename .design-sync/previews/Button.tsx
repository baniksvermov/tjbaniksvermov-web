import { Button } from 'tjbaniksvermov-web'
import { ArrowRight, Send } from 'lucide-react'

export function Primary() {
  return (
    <Button href="/novinky" size="lg">
      Aktuální novinky
      <ArrowRight size={16} />
    </Button>
  )
}

export function OnDarkHero() {
  return (
    <div style={{ background: '#0a0a0a', padding: 24, borderRadius: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button size="lg">
        Aktuální novinky
        <ArrowRight size={16} />
      </Button>
      <Button variant="outline" size="lg">
        Naše týmy
      </Button>
    </div>
  )
}

export function OnPrimaryBackground() {
  return (
    <div style={{ background: '#c8102e', padding: 24, borderRadius: 12 }}>
      <Button variant="inverse" size="lg">
        Zaslat poptávku
        <ArrowRight size={16} />
      </Button>
    </div>
  )
}

export function GhostAndSizes() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="ghost">
        Všechny novinky
        <ArrowRight size={14} />
      </Button>
      <Button size="sm">Malé</Button>
      <Button size="md">Střední</Button>
    </div>
  )
}

export function SubmitDisabled() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button type="submit">
        <Send size={16} />
        Odeslat poptávku
      </Button>
      <Button disabled>Odesílám…</Button>
    </div>
  )
}
