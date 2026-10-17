import { Plus, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import LoadError from 'components/commons/LoadError'
import PageHeader from 'components/commons/PageHeader'
import { Button } from 'components/ui/button'
import { Card } from 'components/ui/card'
import { useFetchEmployees } from 'hooks/reactQuery/useEmployees'
import { routes } from 'routes'
import { EMPLOYEES_PER_PAGE } from './constants'
import Pagination from './Pagination'
import Table from './Table'

const Employees = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const { data, isPending, isError, error, refetch } = useFetchEmployees({
    page,
    perPage: EMPLOYEES_PER_PAGE,
  })

  const addButton = (
    <Button asChild>
      <Link to={routes.employees.new}>
        <Plus />
        {t('employees.actions.add')}
      </Link>
    </Button>
  )

  const renderContent = () => {
    if (isPending)
      return (
        <p role="status" className="p-6 text-sm text-muted-foreground">
          {t('employees.list.loading')}
        </p>
      )
    if (isError) return <LoadError error={error} onRetry={() => refetch()} />
    if (data.meta.total_count === 0)
      return (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <Users className="size-10 text-muted-foreground" />
          <h2 className="font-medium">{t('employees.list.emptyTitle')}</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {t('employees.list.emptyDescription')}
          </p>
          {addButton}
        </div>
      )

    return (
      <>
        <Table employees={data.employees} />
        <Pagination
          meta={data.meta}
          onPageChange={(next) => setSearchParams({ page: next })}
        />
      </>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        title={t('employees.list.title')}
        description={t('employees.list.description')}
        actions={addButton}
      />
      <Card className="gap-0 overflow-hidden py-0">{renderContent()}</Card>
    </main>
  )
}

export default Employees
