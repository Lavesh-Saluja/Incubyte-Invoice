import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import DetailSection from 'components/commons/DetailSection'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table'
import { formatNumber } from 'utils/formatNumber'
import { DEPARTMENT_COLUMNS } from './constants'
import ShareBar from './ShareBar'
import { employeesLink } from './utils'

const Legend = () => {
  const { t } = useTranslation()

  return (
    <div className="mb-4 flex gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-success" />
        {t('dashboard.departments.active')}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-warning" />
        {t('dashboard.departments.notice_period')}
      </span>
    </div>
  )
}

const DepartmentTable = ({ departments, headcount }) => {
  const { t } = useTranslation()

  return (
    <DetailSection title={t('dashboard.departments.title')}>
      {departments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('dashboard.departments.empty')}
        </p>
      ) : (
        <>
          <Legend />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('dashboard.departments.department')}</TableHead>
                {DEPARTMENT_COLUMNS.map(({ key }) => (
                  <TableHead key={key} className="text-right">
                    {t(`dashboard.departments.${key}`)}
                  </TableHead>
                ))}
                <TableHead className="w-2/5">
                  {t('dashboard.departments.share')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((row) => (
                <TableRow key={row.department}>
                  <TableCell className="font-medium">
                    {row.department}
                  </TableCell>
                  {DEPARTMENT_COLUMNS.map(({ key, filters }) => (
                    <TableCell key={key} className="text-right tabular-nums">
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
                    </TableCell>
                  ))}
                  <TableCell>
                    <ShareBar
                      active={row.active}
                      noticePeriod={row.notice_period}
                      headcount={headcount}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </DetailSection>
  )
}

export default DepartmentTable
