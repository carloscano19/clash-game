import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: [
    'bg-[--color-chiliz-red] text-white',
    'hover:bg-[--color-chiliz-red-hover]',
    'active:bg-[--color-chiliz-red-press] active:translate-y-px',
    'disabled:bg-[--color-charcoal-400] disabled:text-[--color-text-disabled] disabled:cursor-not-allowed',
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
  ].join(' '),
  secondary: [
    'bg-[--color-charcoal-700] text-[--color-text-primary] border border-[--color-charcoal-500]',
    'hover:bg-[--color-charcoal-600]',
    'active:bg-[--color-charcoal-800] active:translate-y-px',
    'disabled:bg-[--color-charcoal-400] disabled:text-[--color-text-disabled] disabled:cursor-not-allowed',
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
  ].join(' '),
  ghost: [
    'bg-transparent text-[--color-text-primary]',
    'hover:bg-[--color-charcoal-700]',
    'active:bg-[--color-charcoal-800] active:translate-y-px',
    'disabled:text-[--color-text-disabled] disabled:cursor-not-allowed',
  ].join(' '),
  destructive: [
    'bg-transparent text-white border border-[--color-chiliz-red]',
    'hover:bg-[--color-chiliz-red] hover:bg-opacity-10',
    'active:translate-y-px',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-[--radius-sm]',
  md: 'h-10 px-5 text-sm rounded-[--radius-md]',
  lg: 'h-[52px] px-8 text-base rounded-[--radius-md]',
  xl: 'h-16 px-10 text-lg rounded-[--radius-md]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold',
        'transition-all duration-[--dur-fast]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-cyan-500]',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 rounded-full border-2 border-[--color-cyan-500] border-t-transparent animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
