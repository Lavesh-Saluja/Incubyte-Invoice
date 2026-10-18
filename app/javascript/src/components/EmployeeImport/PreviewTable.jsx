import { CheckCircle2, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from 'cn'
import StatusBadge from 'components/Employees/StatusBadge'
import { EMPLOYEE_STATUSES } from 'components/Employees/constants'
import { formatNumber } from 'utils/formatNumber'
import { PREVIEW_COLUMNS } from './constants'
import { previewAmount } from './utils'

const PreviewTable = ({ rows, total }) => {
  const { t } = useTranslation()

  return (
    <div>
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
              {PREVIEW_COLUMNS.map((column) => (
                <th
                  key={column}
                  className={cn(
                    'px-3 py-2.5 text-left font-medium first:pl-5 last:pr-5',
                    column === 'annual_ctc' && 'text-right',
                  )}
                >
                  {t(`employeeImport.preview.${column}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr
                key={row.row}
                className={cn(!row.valid && 'bg-destructive-surface/60')}
              >
                <td className="py-2.5 pr-3 pl-5 tabular-nums">
                  <span className="inline-flex items-center gap-1.5">
                    {row.valid ? (
                      <CheckCircle2
                        aria-label={t('employeeImport.preview.ready')}
                        className="size-3.5 text-success"
                      />
                    ) : (
                      <XCircle
                        aria-label={t('employeeImport.preview.hasErrors')}
                        className="size-3.5 text-destructive"
                      />
                    )}
                    {row.row}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="font-medium">{row.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {[row.employee_code, row.email].filter(Boolean).join(' · ')}
                  </div>
                </td>
                <td className="px-3 py-2.5">{row.department}</td>
                <td className="px-3 py-2.5">{row.country}</td>
                <td className="px-3 py-2.5">
                  {EMPLOYEE_STATUSES.includes(row.status) ? (
                    <StatusBadge status={row.status} />
                  ) : (
                    row.status
                  )}
                </td>
                <td className="py-2.5 pr-5 pl-3 text-right tabular-nums">
                  {previewAmount(row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > rows.length && (
        <p className="border-t px-5 py-2.5 text-[13px] text-muted-foreground">
          {t('employeeImport.preview.truncated', {
            shown: formatNumber(rows.length),
            total: formatNumber(total),
          })}
        </p>
      )}
    </div>
  )
}

export default PreviewTable
