import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table'
import { cn } from 'cn'
import { routes } from 'routes'
import { formatDate } from 'utils/formatDate'
import { buildUrl } from 'utils/url'
import RowActions from './RowActions'
import StatusBadge from './StatusBadge'
import { fullName } from './utils'

const Table = ({ employees, onNoticeAction }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const showPath = (employee) =>
    buildUrl(routes.employees.show, { id: employee.id })

  return (
    <UITable>
      <TableHeader>
        <TableRow>
          <TableHead>{t('employees.table.employee')}</TableHead>
          <TableHead>{t('employees.table.code')}</TableHead>
          <TableHead>{t('employees.fields.job_title')}</TableHead>
          <TableHead>{t('employees.fields.department')}</TableHead>
          <TableHead>{t('employees.fields.country')}</TableHead>
          <TableHead>{t('employees.table.status')}</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">{t('employees.table.actions')}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow
            key={employee.id}
            className={cn(
              'cursor-pointer',
              employee.status === 'inactive' &&
                'text-muted-foreground opacity-60',
            )}
            onClick={(event) => {
              const isOwnContent = event.currentTarget.contains(event.target)
              const isControl = event.target.closest('a, button')
              if (isOwnContent && !isControl) navigate(showPath(employee))
            }}
          >
            <TableCell>
              <Link
                to={showPath(employee)}
                className="font-medium hover:underline"
              >
                {fullName(employee)}
              </Link>
              <div className="text-xs text-muted-foreground">
                {employee.email}
              </div>
            </TableCell>
            <TableCell className="font-mono text-xs">
              {employee.employee_code}
            </TableCell>
            <TableCell>{employee.job_title}</TableCell>
            <TableCell>{employee.department}</TableCell>
            <TableCell>{employee.country}</TableCell>
            <TableCell>
              <StatusBadge status={employee.status} />
              {employee.status === 'notice_period' && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {t('employees.notice.until', {
                    date: formatDate(employee.notice_period_ends_at),
                  })}
                </div>
              )}
            </TableCell>
            <TableCell className="text-right">
              <RowActions employee={employee} onNoticeAction={onNoticeAction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </UITable>
  )
}

export default Table
