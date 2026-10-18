import { useTranslation } from 'react-i18next'
import { cn } from 'cn'
import { formatCurrency } from 'utils/formatCurrency'
import { formatNumber } from 'utils/formatNumber'
import { STAT_COLUMNS, WHOLE_UNITS } from './constants'

const PayTable = ({ rows, nameLabel, renderName, isSelected, dimmed }) => {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'relative overflow-x-auto transition-opacity',
        dimmed && 'opacity-60',
      )}
    >
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
            <th className="px-5 py-2.5 text-left font-medium">{nameLabel}</th>
            <th className="px-3 py-2.5 text-right font-medium">
              {t('pay.table.employees')}
            </th>
            {STAT_COLUMNS.map(({ key, labelKey }) => (
              <th
                key={key}
                className="px-3 py-2.5 text-right font-medium last:pr-5"
              >
                {t(labelKey)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr
              key={row.code ?? row.id}
              aria-current={isSelected?.(row) || undefined}
              className={cn(
                'hover:bg-muted/40',
                isSelected?.(row) && 'bg-accent/60 hover:bg-accent/60',
              )}
            >
              <td className="px-5 py-3">{renderName(row)}</td>
              <td className="px-3 py-3 text-right tabular-nums">
                {formatNumber(row.employees)}
              </td>
              {STAT_COLUMNS.map(({ key }) => (
                <td
                  key={key}
                  className={cn(
                    'px-3 py-3 text-right whitespace-nowrap tabular-nums last:pr-5',
                    key === 'median_ctc' && 'font-medium',
                  )}
                >
                  {formatCurrency(row[key], row.currency, WHOLE_UNITS)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PayTable
