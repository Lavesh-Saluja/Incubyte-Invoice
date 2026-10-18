import { Plus, SearchX, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import LoadError from 'components/commons/LoadError'
import PageHeader from 'components/commons/PageHeader'
import { Button } from 'components/ui/button'
import { Card } from 'components/ui/card'
import { useFetchEmployees } from 'hooks/reactQuery/useEmployees'
import { useCountries, useDepartments } from 'hooks/reactQuery/useSelectOptions'
import { useDebouncedValue } from 'hooks/useDebouncedValue'
import { routes } from 'routes'
import ActiveFilters from './ActiveFilters'
import {
  EMPLOYEE_STATUSES,
  EMPLOYEES_PER_PAGE,
  FILTER_KEYS,
  SEARCH_DEBOUNCE_MS,
} from './constants'
import Filters from './Filters'
import NoticeDialog from './NoticeDialog'
import Pagination from './Pagination'
import Table from './Table'

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
    <Icon className="size-10 text-muted-foreground" />
    <h2 className="font-medium">{title}</h2>
    <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    {action}
  </div>
)

const Employees = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [noticeDialog, setNoticeDialog] = useState(null)
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const filters = Object.fromEntries(
    FILTER_KEYS.map((key) => [key, searchParams.get(key) ?? '']),
  )
  const debouncedQuery = useDebouncedValue(filters.q.trim(), SEARCH_DEBOUNCE_MS)
  const activeFilters = Object.fromEntries(
    Object.entries({ ...filters, q: debouncedQuery }).filter(([, value]) =>
      Boolean(value),
    ),
  )
  const hasFilters = Object.values(filters).some(Boolean)
  const { data: departments = [] } = useDepartments()
  const { data: countries = [] } = useCountries({ inUse: true })
  const filterOptions = {
    status: EMPLOYEE_STATUSES.map((status) => ({
      value: status,
      label: t(`employees.status.${status}`),
    })),
    department: departments.map((department) => ({
      value: department,
      label: department,
    })),
    country: countries.map(({ code, name }) => ({ value: code, label: name })),
  }
  const { data, isPending, isError, error, refetch } = useFetchEmployees({
    page,
    perPage: EMPLOYEES_PER_PAGE,
    filters: activeFilters,
  })

  const updateSearchParams = (changes, options) =>
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      Object.entries(changes).forEach(([key, value]) =>
        value ? next.set(key, value) : next.delete(key),
      )
      return next
    }, options)

  const handleFilterChange = (key, value) =>
    updateSearchParams({ [key]: value, page: '' }, { replace: key === 'q' })

  const clearFilters = () =>
    updateSearchParams(
      Object.fromEntries([...FILTER_KEYS, 'page'].map((key) => [key, ''])),
    )

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
      return hasFilters ? (
        <EmptyState
          icon={SearchX}
          title={t('employees.filters.noMatchesTitle')}
          description={t('employees.filters.noMatchesDescription')}
          action={
            <Button variant="outline" onClick={clearFilters}>
              {t('employees.filters.clear')}
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={Users}
          title={t('employees.list.emptyTitle')}
          description={t('employees.list.emptyDescription')}
          action={addButton}
        />
      )

    return (
      <>
        <Table employees={data.employees} onNoticeAction={setNoticeDialog} />
        <Pagination
          meta={data.meta}
          onPageChange={(next) => updateSearchParams({ page: String(next) })}
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
      <div className="mb-4 flex flex-col gap-3">
        <Filters
          filters={filters}
          options={filterOptions}
          onChange={handleFilterChange}
        />
        <ActiveFilters
          filters={filters}
          options={filterOptions}
          onRemove={(key) => handleFilterChange(key, '')}
          onClear={clearFilters}
        />
      </div>
      <Card className="gap-0 overflow-hidden py-0">{renderContent()}</Card>
      <NoticeDialog
        dialog={noticeDialog}
        onClose={() => setNoticeDialog(null)}
      />
    </main>
  )
}

export default Employees
