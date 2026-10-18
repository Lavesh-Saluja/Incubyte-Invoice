import { cn } from 'cn'

const EmptyState = ({ icon: Icon, title, description, action, compact }) => (
  <div
    className={cn(
      'flex flex-col items-center text-center',
      compact ? 'gap-2 py-6' : 'gap-3 px-6 py-16',
    )}
  >
    <span className="flex size-10 items-center justify-center rounded-full bg-muted">
      <Icon className="size-5 text-muted-foreground" />
    </span>
    <h2 className="text-sm font-semibold">{title}</h2>
    {description && (
      <p className="max-w-sm text-[13px] text-muted-foreground">
        {description}
      </p>
    )}
    {action}
  </div>
)

export default EmptyState
