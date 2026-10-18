import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

const Breadcrumbs = ({ items }) => {
  const { t } = useTranslation()

  return (
    <nav aria-label={t('nav.breadcrumb')} className="mb-2">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground">
        {items.map(({ label, to }, index) => (
          <Fragment key={label}>
            {index > 0 && (
              <ChevronRight aria-hidden="true" className="size-3.5" />
            )}
            <li>
              {to ? (
                <Link to={to} className="hover:text-foreground">
                  {label}
                </Link>
              ) : (
                <span aria-current="page" className="text-foreground">
                  {label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
