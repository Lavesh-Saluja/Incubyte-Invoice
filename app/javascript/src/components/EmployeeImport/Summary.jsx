import { useTranslation } from 'react-i18next'
import { cn } from 'cn'
import { formatNumber } from 'utils/formatNumber'
import { SUMMARY_TILES } from './constants'

const Summary = ({ result }) => {
  const { t } = useTranslation()

  return (
    <dl className="grid grid-cols-3 divide-x border-b">
      {SUMMARY_TILES.map(({ key, tone }) => (
        <div key={key} className="min-w-0 px-5 py-4">
          <dt className="text-xs text-muted-foreground">
            {t(`employeeImport.summary.${key}`)}
          </dt>
          <dd
            className={cn(
              'mt-1 text-2xl font-semibold tabular-nums',
              result[key] > 0 ? tone : 'text-muted-foreground',
            )}
          >
            {formatNumber(result[key])}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default Summary
