import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import { cn } from 'cn'
import Initials from 'components/commons/Initials'
import { routes } from 'routes'
import { formatDate } from 'utils/formatDate'
import { buildUrl } from 'utils/url'
import RowActions from './RowActions'
import StatusBadge from './StatusBadge'
import { fullName, initials } from './utils'

const HEAD_CLASS = 'px-4 py-2.5 text-left text-xs font-medium whitespace-nowrap'

const Table = ({ employees, onNoticeAction }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const showPath = (employee) =>
    buildUrl(routes.employees.show, { id: employee.id })

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[880px] text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-muted-foreground">
            <th className={cn(HEAD_CLASS, 'pl-5')}>
              {t('employees.table.employee')}
            </th>
            <th className={HEAD_CLASS}>{t('employees.table.code')}</th>
            <th className={HEAD_CLASS}>{t('employees.fields.job_title')}</th>
            <th className={HEAD_CLASS}>{t('employees.fields.department')}</th>
            <th className={HEAD_CLASS}>{t('employees.fields.country')}</th>
            <th className={HEAD_CLASS}>{t('employees.table.status')}</th>
            <th className={cn(HEAD_CLASS, 'w-0 pr-5')}>
              <span className="sr-only">{t('employees.table.actions')}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className={cn(
                'cursor-pointer transition-colors hover:bg-muted/40',
                employee.status === 'inactive' && 'opacity-60',
              )}
              onClick={(event) => {
                const isOwnContent = event.currentTarget.contains(event.target)
                const isControl = event.target.closest('a, button')
                if (isOwnContent && !isControl) navigate(showPath(employee))
              }}
            >
              <td className="py-3 pr-4 pl-5">
                <div className="flex items-center gap-3">
                  <Initials>{initials(employee)}</Initials>
                  <div className="min-w-0">
                    <Link
                      to={showPath(employee)}
                      className="block truncate font-medium hover:text-primary"
                    >
                      {fullName(employee)}
                    </Link>
                    <div className="truncate text-xs text-muted-foreground">
                      {employee.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-[13px] whitespace-nowrap text-muted-foreground tabular-nums">
                {employee.employee_code}
              </td>
              <td className="px-4 py-3">{employee.job_title}</td>
              <td className="px-4 py-3">{employee.department.name}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {employee.country_name}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={employee.status} />
                {employee.status === 'notice_period' && (
                  <div className="mt-1 text-xs whitespace-nowrap text-muted-foreground">
                    {t('employees.notice.until', {
                      date: formatDate(employee.notice_period_ends_at),
                    })}
                  </div>
                )}
              </td>
              <td className="py-3 pr-5 pl-4 text-right">
                <RowActions
                  employee={employee}
                  onNoticeAction={onNoticeAction}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
