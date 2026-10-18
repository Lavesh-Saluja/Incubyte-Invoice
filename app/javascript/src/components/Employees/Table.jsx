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
import { routes } from 'routes'
import { buildUrl } from 'utils/url'
import StatusBadge from './StatusBadge'
import { fullName } from './utils'

const Table = ({ employees }) => {
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow
            key={employee.id}
            className="cursor-pointer"
            onClick={(event) => {
              if (!event.target.closest('a')) navigate(showPath(employee))
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </UITable>
  )
}

export default Table
