import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Badge } from 'components/ui/badge'
import { Button } from 'components/ui/button'
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
import { STATUS_BADGE_VARIANTS } from './constants'
import { fullName } from './utils'

const Table = ({ employees }) => {
  const { t } = useTranslation()

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
          <TableRow key={employee.id}>
            <TableCell>
              <div className="font-medium">{fullName(employee)}</div>
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
              <Badge variant={STATUS_BADGE_VARIANTS[employee.status]}>
                {t(`employees.status.${employee.status}`)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  to={buildUrl(routes.employees.edit, { id: employee.id })}
                  aria-label={t('employees.actions.editLabel', {
                    name: fullName(employee),
                  })}
                >
                  <Pencil />
                  {t('employees.actions.edit')}
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </UITable>
  )
}

export default Table
