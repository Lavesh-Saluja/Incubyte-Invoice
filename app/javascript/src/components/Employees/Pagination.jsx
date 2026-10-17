import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/ui/button'
import { formatNumber } from 'utils/formatNumber'

const Pagination = ({ meta, onPageChange }) => {
  const { t } = useTranslation()
  const { page, per_page: perPage, total_count: total, total_pages } = meta
  const from = (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground">
      <span>
        {t('employees.pagination.range', {
          from: formatNumber(from),
          to: formatNumber(to),
          total: formatNumber(total),
        })}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft />
          {t('employees.pagination.previous')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= total_pages}
        >
          {t('employees.pagination.next')}
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
