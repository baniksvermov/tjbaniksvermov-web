import type { ComponentPropsWithoutRef } from 'react'

type SelectProps = ComponentPropsWithoutRef<'select'>

export function Select({ className = '', ...props }: SelectProps) {
  return (
    <select
      className={`w-full rounded-lg border border-border px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${className}`}
      {...props}
    />
  )
}
