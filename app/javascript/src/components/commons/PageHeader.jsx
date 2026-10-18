import Breadcrumbs from 'components/commons/Breadcrumbs'

const PageHeader = ({ title, description, actions, breadcrumbs }) => (
  <div className="mb-6">
    {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[28px] leading-9 font-semibold">{title}</h1>
        {description && (
          <div className="mt-1 text-sm text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  </div>
)

export default PageHeader
