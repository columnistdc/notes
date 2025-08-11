import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  'aria-label'?: string
}

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, fullWidth, size = 'md', type = 'button', 'aria-label': ariaLabel, ...props },
  ref,
) {
  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-sm rounded-md'
      : size === 'lg'
        ? 'px-6 py-3 text-lg rounded-xl'
        : 'px-4 py-2 rounded-lg'

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={clsx(
        'inline-flex items-center justify-center bg-white transition',
        'hover:-translate-y-px hover:shadow',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'focus-visible:ring-cyan-400 focus-visible:ring-offset-transparent',
        'border-2 border-[rgba(255,165,0,0.5)]',
        'focus-visible:border-cyan-400',
        sizeClasses,
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  )
})

export default Button
