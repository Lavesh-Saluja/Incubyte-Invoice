const DetailList = ({ items, variant = 'rows' }) =>
  variant === 'amounts' ? (
    <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
      {items.map(({ label, value }) => (
        <div key={label} className="min-w-0">
          <dt className="text-[13px] text-muted-foreground">{label}</dt>
          <dd className="mt-1 text-lg font-semibold tracking-tight tabular-nums">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  ) : (
    <dl className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm">
      {items.map(({ label, value }) => (
        <div key={label} className="contents">
          <dt className="text-[13px] text-muted-foreground">{label}</dt>
          <dd className="font-medium break-words">{value}</dd>
        </div>
      ))}
    </dl>
  )

export default DetailList
