import { cn } from 'cn'
import { Card } from 'components/ui/card'

const DetailSection = ({
  title,
  description,
  actions,
  className,
  children,
}) => (
  <Card className={cn('gap-0 py-0', className)}>
    <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4">
      <div className="min-w-0">
        <h2 className="text-base font-semibold">{title}</h2>
        {description && (
          <p className="mt-1 text-[13px] text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
    <div className="px-5 pb-5">{children}</div>
  </Card>
)

export default DetailSection
