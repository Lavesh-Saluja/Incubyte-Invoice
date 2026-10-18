import { Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import EmptyState from 'components/commons/EmptyState'
import LoadError from 'components/commons/LoadError'
import PageHeader from 'components/commons/PageHeader'
import Spinner from 'components/commons/Spinner'
import { employeesLink } from 'components/Dashboard/utils'
import { Button } from 'components/ui/button'
import { Card } from 'components/ui/card'
import { usePaySummary } from 'hooks/reactQuery/usePaySummary'
import { routes } from 'routes'
import PayTable from './PayTable'

const SectionHeader = ({ title, description, action }) => (
  <div className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
    <div className="min-w-0">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>
    </div>
    {action}
  </div>
)

const Pay = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('country') ?? ''
  const { data, isPending, isError, error, refetch, isPlaceholderData } =
    usePaySummary(requested)

  const renderContent = () => {
    if (isPending) return <Spinner label={t('pay.loading')} />
    if (isError)
      return (
        <Card className="py-0">
          <LoadError error={error} onRetry={() => refetch()} />
        </Card>
      )
    if (data.countries.length === 0)
      return (
        <Card className="py-0">
          <EmptyState
            icon={Wallet}
            title={t('pay.emptyTitle')}
            description={t('pay.emptyDescription')}
            action={
              <Button variant="outline" asChild>
                <Link to={routes.employees.import}>
                  {t('employeeImport.actions.open')}
                </Link>
              </Button>
            }
          />
        </Card>
      )

    const selected = data.countries.find((row) => row.code === data.country)

    return (
      <div className="flex flex-col gap-6">
        <Card className="gap-0 overflow-hidden py-0">
          <SectionHeader
            title={t('pay.byCountry')}
            description={t('pay.byCountryDescription')}
          />
          <PayTable
            rows={data.countries}
            nameLabel={t('pay.table.country')}
            isSelected={(row) => row.code === data.country}
            renderName={(row) => (
              <button
                type="button"
                onClick={() => setSearchParams({ country: row.code })}
                className="text-left font-medium hover:text-primary hover:underline"
              >
                {row.name}
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  {row.currency}
                </span>
              </button>
            )}
          />
        </Card>
        <Card className="gap-0 overflow-hidden py-0">
          <SectionHeader
            title={t('pay.inCountry', { country: selected.name })}
            description={t('pay.inCountryDescription', {
              currency: selected.currency,
            })}
            action={
              <Button variant="outline" size="sm" asChild>
                <Link to={employeesLink({ country: selected.code })}>
                  {t('pay.viewEmployees')}
                </Link>
              </Button>
            }
          />
          <PayTable
            rows={data.departments}
            nameLabel={t('pay.table.department')}
            dimmed={isPlaceholderData}
            renderName={(row) => (
              <Link
                to={employeesLink({
                  country: selected.code,
                  department_id: row.id,
                })}
                className="font-medium hover:text-primary hover:underline"
              >
                {row.name}
              </Link>
            )}
          />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={t('pay.title')} description={t('pay.description')} />
      {renderContent()}
    </div>
  )
}

export default Pay
