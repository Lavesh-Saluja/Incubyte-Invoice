import { cn } from 'cn'

const Initials = ({ children, className }) => (
  <span
    aria-hidden="true"
    className={cn(
      'flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground',
      className,
    )}
  >
    {children}
  </span>
)

export default Initials
