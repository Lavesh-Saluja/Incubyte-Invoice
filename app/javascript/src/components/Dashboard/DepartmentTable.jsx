import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import DetailSection from 'components/commons/DetailSection'
import { formatNumber } from 'utils/formatNumber'
import { DEPARTMENT_COLUMNS } from './constants'
import ShareBar from './ShareBar'
import { employeesLink } from './utils'

const DepartmentTable = ({ departments, headcount }) => {
  const { t } = useTranslation()

  return (
    <DetailSection title={t('dashboard.departments.title')}>
      {departments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('dashboard.departments.empty')}
        </p>
      ) : (
        <div className="relative -mx-5 -mb-5 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-y bg-muted/40 text-xs text-muted-foreground">
                <th className="px-5 py-2.5 text-left font-medium">
                  {t('dashboard.departments.department')}
                </th>
                {DEPARTMENT_COLUMNS.map(({ key }) => (
                  <th key={key} className="px-3 py-2.5 text-right font-medium">
                    {t(`dashboard.departments.${key}`)}
                  </th>
                ))}
                <th className="w-2/5 px-5 py-2.5 text-left font-medium">
                  {t('dashboard.departments.share')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {departments.map((row) => (
                <tr key={row.department} className="hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <Link
                      to={employeesLink({ department: row.department })}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {row.department}
                    </Link>
                  </td>
                  {DEPARTMENT_COLUMNS.map(({ key, filters }) => (
                    <td key={key} className="px-3 py-3 text-right tabular-nums">
                      <Link
                        to={employeesLink({
                          department: row.department,
                          ...filters,
                        })}
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
                    <ShareBar value={row.total} headcount={headcount} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DetailSection>
  )
}

export default DepartmentTable
