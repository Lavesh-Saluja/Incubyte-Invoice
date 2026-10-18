import { Info } from 'lucide-react'
import { cn } from 'cn'

const TONES = {
  warning: 'border-warning/25 bg-warning-surface text-warning',
  info: 'border-primary/20 bg-accent text-accent-foreground',
}

const Callout = ({ tone = 'info', children }) => (
  <div
    className={cn(
      'flex gap-2.5 rounded-md border px-3 py-2.5 text-[13px] leading-5',
      TONES[tone],
    )}
  >
    <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
    <p>{children}</p>
  </div>
)

export default Callout
