import type { ComponentPropsWithoutRef } from 'react'

type LabelProps = ComponentPropsWithoutRef<'label'>

export default function Label({ className = '', ...props }: LabelProps) {
  return <label className={`mb-1.5 block text-sm font-medium text-gray-700 ${className}`} {...props} />
}
