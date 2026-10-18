import { useTranslation } from 'react-i18next'
import LoadError from 'components/commons/LoadError'
import Spinner from 'components/commons/Spinner'
import { useDashboard } from 'hooks/reactQuery/useDashboard'
import { STAT_CARDS } from './constants'
import DepartmentTable from './DepartmentTable'
import StatCard from './StatCard'
import UpcomingDepartures from './UpcomingDepartures'
import { employeesLink } from './utils'

const Dashboard = () => {
  const { t } = useTranslation()
  const { data, isPending, isError, error, refetch } = useDashboard()

  const renderContent = () => {
    if (isPending)
      return <Spinner label={t('dashboard.loading')} className="min-h-[60vh]" />
    if (isError) return <LoadError error={error} onRetry={() => refetch()} />

    const { counts, departments, upcoming_departures, leaving_soon_days } = data
    const percentOfHeadcount = (value) =>
      counts.current_headcount === 0
        ? 0
        : Math.round((value / counts.current_headcount) * 100)

    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map(({ key, icon, iconClassName, filters }) => (
            <StatCard
              key={key}
              to={employeesLink(filters)}
              label={t(`dashboard.cards.${key}.label`)}
              hint={t(`dashboard.cards.${key}.hint`, {
                count: counts.leaving_soon,
                days: leaving_soon_days,
                percent: percentOfHeadcount(counts[key]),
              })}
              value={counts[key]}
              icon={icon}
              iconClassName={iconClassName}
            />
          ))}
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DepartmentTable
              departments={departments}
              headcount={counts.current_headcount}
            />
          </div>
          <UpcomingDepartures
            employees={upcoming_departures}
            days={leaving_soon_days}
          />
        </div>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="sr-only">{t('dashboard.title')}</h1>
      {renderContent()}
    </main>
  )
}

export default Dashboard
