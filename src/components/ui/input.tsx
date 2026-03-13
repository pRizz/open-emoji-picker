import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

import { cn } from '@/lib/utils'

type InputProps = JSX.InputHTMLAttributes<HTMLInputElement>

export function Input(props: InputProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <input
      class={cn(
        'flex h-12 w-full rounded-2xl border border-border bg-panel px-4 py-3 text-sm text-foreground shadow-sm shadow-black/10 transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50',
        local.class,
      )}
      {...others}
    />
  )
}
