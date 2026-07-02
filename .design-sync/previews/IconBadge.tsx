import { IconBadge } from 'tjbaniksvermov-web'
import { Calendar, Users, ShoppingBag } from 'lucide-react'

export function SoftDefault() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <IconBadge>
        <Calendar size={24} />
      </IconBadge>
      <IconBadge shape="circle">
        <Users size={24} />
      </IconBadge>
    </div>
  )
}

export function SolidLogoMark() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconBadge tone="solid" shape="circle" size="sm" className="text-sm leading-none">
        TJB
      </IconBadge>
      <IconBadge tone="solid">
        <ShoppingBag size={24} />
      </IconBadge>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconBadge size="sm">
        <Calendar size={16} />
      </IconBadge>
      <IconBadge size="md">
        <Calendar size={24} />
      </IconBadge>
      <IconBadge size="lg">
        <Calendar size={32} />
      </IconBadge>
    </div>
  )
}

export function Bordered() {
  return (
    <IconBadge bordered size="lg">
      <Calendar size={32} />
    </IconBadge>
  )
}
