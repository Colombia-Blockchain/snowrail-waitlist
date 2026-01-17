import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  error?: string
}

export function Checkbox({ label, error, className = '', id, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id || generatedId

  return (
    <div className="w-full">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={checkboxId}
          className={`checkbox-base mt-0.5 ${className}`}
          {...props}
        />
        <label htmlFor={checkboxId} className="text-sm text-snow-1 cursor-pointer select-none">
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error">{error}</p>
      )}
    </div>
  )
}
