import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from 'components/ui/card'
import { formatNumber } from 'utils/formatNumber'

const StatCard = ({ to, label, value, hint, icon: Icon, iconClassName }) => (
  <Link
    to={to}
    className="group rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
  >
    <Card className="h-full gap-4 px-5 py-5 transition-all group-hover:border-primary/40 group-hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex size-10 items-center justify-center rounded-lg ${iconClassName}`}
        >
          <Icon className="size-5" />
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div>
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
          {formatNumber(value)}
        </div>
      </div>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    </Card>
  </Link>
)

export default StatCard
