import './_polyfill'
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

type ButtonVariant = 'primary' | 'inverse' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'rounded-lg bg-primary text-white hover:bg-primary-hover',
  inverse: 'rounded-lg bg-white text-primary hover:bg-red-50',
  outline: 'rounded-lg border border-white/20 text-white hover:bg-white/10',
  ghost: 'text-primary font-medium hover:underline',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
}

const base =
  'inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none'

interface ButtonOwnProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

type ButtonAsLink = ButtonOwnProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    'href' | 'className'
  >

type ButtonAsButton = ButtonOwnProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<'button'>,
    'className'
  >

type ButtonProps = ButtonAsLink | ButtonAsButton

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  ...props
}: ButtonProps) {
  const classes =
    variant === 'ghost'
      ? `${base} ${variantClasses.ghost} ${className}`
      : `${base} ${variantClasses[variant]} ${sizeClasses[size]} font-semibold ${className}`

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'className'>)}
      />
    )
  }
  return <button className={classes} {...(props as ComponentPropsWithoutRef<'button'>)} />
}
