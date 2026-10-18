import { CalendarCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import DetailSection from 'components/commons/DetailSection'
import EmptyState from 'components/commons/EmptyState'
import Initials from 'components/commons/Initials'
import { DAY_IN_MS } from 'components/Employees/constants'
import { fullName, initials } from 'components/Employees/utils'
import { routes } from 'routes'
import { formatDate } from 'utils/formatDate'
import { buildUrl } from 'utils/url'
import { employeesLink } from './utils'

const UpcomingDepartures = ({ employees, days }) => {
  const { t } = useTranslation()
  const [now] = useState(() => Date.now())
  const daysLeft = (date) =>
    Math.max(0, Math.ceil((new Date(date).getTime() - now) / DAY_IN_MS))

  return (
    <DetailSection
      title={t('dashboard.departures.title')}
      description={t('dashboard.departures.description', { count: days })}
      actions={
        <Link
          to={employeesLink({ status: 'notice_period' })}
          className="text-[13px] font-medium text-primary hover:underline"
        >
          {t('dashboard.departures.viewAll')}
        </Link>
      }
    >
      {employees.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title={t('dashboard.departures.emptyTitle')}
          description={t('dashboard.departures.empty', { count: days })}
          compact
        />
      ) : (
        <ul className="-mx-2 -my-1 divide-y">
          {employees.map((employee) => (
            <li key={employee.id}>
              <Link
                to={buildUrl(routes.employees.show, { id: employee.id })}
                className="flex items-center gap-3 rounded-md px-2 py-3 hover:bg-muted/50"
              >
                <Initials className="bg-muted text-muted-foreground">
                  {initials(employee)}
                </Initials>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {fullName(employee)}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {employee.department}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[13px] tabular-nums">
                    {formatDate(employee.notice_period_ends_at)}
                  </span>
                  <span className="block text-xs font-medium text-warning">
                    {t('dashboard.departures.daysLeft', {
                      count: daysLeft(employee.notice_period_ends_at),
                    })}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DetailSection>
  )
}

export default UpcomingDepartures
