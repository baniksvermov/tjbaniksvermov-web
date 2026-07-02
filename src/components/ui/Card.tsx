interface CardProps {
  children: React.ReactNode
  hoverable?: boolean
  className?: string
}

export function Card({ children, hoverable = false, className = '' }: CardProps) {
  const hoverClasses = hoverable ? 'hover:shadow-md hover:border-primary/30 transition-all' : ''

  return (
    <div className={`rounded-xl border border-border bg-white overflow-hidden ${hoverClasses} ${className}`}>
      {children}
    </div>
  )
}
