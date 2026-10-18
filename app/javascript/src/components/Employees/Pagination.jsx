import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from 'cn'
import { Button } from 'components/ui/button'
import { formatNumber } from 'utils/formatNumber'
import { pageItems } from './utils'

const Pagination = ({ meta, onPageChange }) => {
  const { t } = useTranslation()
  const { page, per_page: perPage, total_count: total, total_pages } = meta
  const from = (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  return (
    <nav
      aria-label={t('employees.pagination.label')}
      className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3"
    >
      <span className="text-[13px] text-muted-foreground">
        {t('employees.pagination.range', {
          from: formatNumber(from),
          to: formatNumber(to),
          total: formatNumber(total),
        })}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label={t('employees.pagination.previous')}
        >
          <ChevronLeft />
        </Button>
        {pageItems(page, total_pages).map((item, index) =>
          item === null ? (
            <MoreHorizontal
              key={`gap-${index}`}
              aria-hidden="true"
              className="mx-2 size-4 text-muted-foreground"
            />
          ) : (
            <Button
              key={item}
              variant={item === page ? 'default' : 'ghost'}
              size="icon-sm"
              className={cn('tabular-nums', item !== page && 'font-normal')}
              aria-current={item === page ? 'page' : undefined}
              aria-label={t('employees.pagination.page', { page: item })}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          ),
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= total_pages}
          aria-label={t('employees.pagination.next')}
        >
          <ChevronRight />
        </Button>
      </div>
    </nav>
  )
}

export default Pagination
