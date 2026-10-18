import { Link } from 'react-router'
import { cn } from 'cn'
import { formatNumber } from 'utils/formatNumber'

const StatCard = ({
  to,
  label,
  value,
  hint,
  highlight = false,
  icon: Icon,
  iconClassName,
}) => (
  <Link
    to={to}
    className="group flex items-start gap-4 rounded-lg border bg-card p-5 shadow-xs transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
  >
    <span
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-lg',
        iconClassName,
      )}
    >
      <Icon className="size-5" />
    </span>
    <span className="min-w-0">
      <span className="block text-[13px] font-medium text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 block text-[28px] leading-8 font-semibold tracking-tight tabular-nums">
        {formatNumber(value)}
      </span>
      {hint && (
        <span
          className={cn(
            'mt-1 block text-xs',
            highlight ? 'font-medium text-warning' : 'text-muted-foreground',
          )}
        >
          {hint}
        </span>
      )}
    </span>
  </Link>
)

export default StatCard
