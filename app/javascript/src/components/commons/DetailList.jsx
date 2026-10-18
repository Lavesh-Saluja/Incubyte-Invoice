import { cn } from 'cn'

const DetailList = ({ items, columns = 2 }) => (
  <dl className={cn('grid gap-x-6 gap-y-5', columns === 2 && 'sm:grid-cols-2')}>
    {items.map(({ label, value }) => (
      <div key={label} className="min-w-0">
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <dd className="mt-1 font-medium break-words">{value}</dd>
      </div>
    ))}
  </dl>
)

export default DetailList
