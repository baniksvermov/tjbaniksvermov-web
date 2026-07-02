type IconBadgeSize = 'sm' | 'md' | 'lg'
type IconBadgeShape = 'circle' | 'square'
type IconBadgeTone = 'soft' | 'solid'

const sizeClasses: Record<IconBadgeSize, string> = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-16 w-16',
}

const toneClasses: Record<IconBadgeTone, string> = {
  soft: 'bg-primary/10 text-primary',
  solid: 'bg-primary text-white',
}

interface IconBadgeProps {
  children: React.ReactNode
  size?: IconBadgeSize
  shape?: IconBadgeShape
  tone?: IconBadgeTone
  bordered?: boolean
  className?: string
}

export function IconBadge({
  children,
  size = 'md',
  shape = 'square',
  tone = 'soft',
  bordered = false,
  className = '',
}: IconBadgeProps) {
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl'
  const borderClass = bordered ? 'border border-primary/20' : ''

  return (
    <div
      className={`flex shrink-0 items-center justify-center font-bold ${toneClasses[tone]} ${shapeClass} ${sizeClasses[size]} ${borderClass} ${className}`}
    >
      {children}
    </div>
  )
}
