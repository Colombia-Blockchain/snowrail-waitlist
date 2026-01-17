import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: ReactNode
  fullWidth?: boolean
}

export function PrimaryButton({ children, className = '', fullWidth = false, ...props }: ButtonProps) {
  return (
    <button
      className={`btn-base btn-primary ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', fullWidth = false, ...props }: ButtonProps) {
  return (
    <button
      className={`btn-base btn-secondary ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Button({ variant = 'primary', children, className = '', fullWidth = false, ...props }: ButtonProps) {
  if (variant === 'secondary') {
    return <SecondaryButton className={className} fullWidth={fullWidth} {...props}>{children}</SecondaryButton>
  }
  return <PrimaryButton className={className} fullWidth={fullWidth} {...props}>{children}</PrimaryButton>
}
