interface BadgeProps {
  children: React.ReactNode
  color?: string
  variant?: 'solid' | 'soft'
  className?: string
}

export function Badge({ children, color, variant = 'solid', className = '' }: BadgeProps) {
  if (color) {
    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${className}`}
        style={{ backgroundColor: color }}
      >
        {children}
      </span>
    )
  }

  const variantClasses = variant === 'solid' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variantClasses} ${className}`}>
      {children}
    </span>
  )
}
