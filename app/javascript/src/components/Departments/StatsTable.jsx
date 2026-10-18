import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import ShareBar from 'components/Dashboard/ShareBar'
import { employeesLink } from 'components/Dashboard/utils'
import { formatNumber } from 'utils/formatNumber'
import { STATUS_COLUMNS } from './constants'

const StatsTable = ({ rows, columns = STATUS_COLUMNS, headcount }) => {
  const { t } = useTranslation()

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
            <th className="px-5 py-2.5 text-left font-medium">
              {t('departments.table.department')}
            </th>
            {columns.map(({ key }) => (
              <th key={key} className="px-3 py-2.5 text-right font-medium">
                {t(`departments.table.${key}`)}
              </th>
            ))}
            <th className="w-2/5 px-5 py-2.5 text-left font-medium">
              {t('departments.table.share')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-muted/40">
              <td className="px-5 py-3">
                <Link
                  to={employeesLink({ department_id: row.id })}
                  className="font-medium hover:text-primary hover:underline"
                >
                  {row.name}
                </Link>
              </td>
              {columns.map(({ key, filters }) => (
                <td key={key} className="px-3 py-3 text-right tabular-nums">
                  <Link
                    to={employeesLink({ department_id: row.id, ...filters })}
                    className={
                      row[key] === 0
                        ? 'text-muted-foreground hover:underline'
                        : 'font-medium text-primary hover:underline'
                    }
                  >
                    {formatNumber(row[key])}
                  </Link>
                </td>
              ))}
              <td className="px-5 py-3">
                <ShareBar value={row.current} headcount={headcount} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StatsTable
