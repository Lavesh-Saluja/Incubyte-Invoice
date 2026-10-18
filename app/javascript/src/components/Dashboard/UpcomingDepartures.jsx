import { CalendarCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import DetailSection from 'components/commons/DetailSection'
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
    >
      {employees.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <CalendarCheck className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t('dashboard.departures.empty', { count: days })}
          </p>
        </div>
      ) : (
        <ul className="-my-2 divide-y">
          {employees.map((employee) => (
            <li key={employee.id}>
              <Link
                to={buildUrl(routes.employees.show, { id: employee.id })}
                className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2.5 hover:bg-accent"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-warning-surface text-xs font-semibold text-warning"
                  >
                    {initials(employee)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {fullName(employee)}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {employee.department}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-right text-sm">
                  <span className="block font-medium">
                    {formatDate(employee.notice_period_ends_at)}
                  </span>
                  <span className="block text-xs text-warning">
                    {t('dashboard.departures.inDays', {
                      count: daysLeft(employee.notice_period_ends_at),
                    })}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        to={employeesLink({ status: 'notice_period' })}
        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        {t('dashboard.departures.viewAll')}
      </Link>
    </DetailSection>
  )
}

export default UpcomingDepartures
