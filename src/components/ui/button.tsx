import { cva, type VariantProps } from 'class-variance-authority'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90',
        ghost: 'text-foreground hover:bg-secondary',
        outline:
          'border border-border bg-panel/80 text-foreground shadow-sm shadow-black/10 hover:bg-panel',
        subtle: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
      size: {
        default: 'h-10 px-4 py-2',
        icon: 'size-10',
        sm: 'h-9 px-3 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ['class', 'variant', 'size'])

  return <button class={cn(buttonVariants({ variant: local.variant, size: local.size }), local.class)} {...others} />
}
