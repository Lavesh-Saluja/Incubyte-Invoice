import { Download, Plus, SearchX, Upload, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import EmptyState from 'components/commons/EmptyState'
import LoadError from 'components/commons/LoadError'
import Spinner from 'components/commons/Spinner'
import PageHeader from 'components/commons/PageHeader'
import { Button } from 'components/ui/button'
import { Card } from 'components/ui/card'
import { useFetchEmployees } from 'hooks/reactQuery/useEmployees'
import { useCreateExport } from 'hooks/reactQuery/useExports'
import { useCountries, useDepartments } from 'hooks/reactQuery/useSelectOptions'
import { useDebouncedValue } from 'hooks/useDebouncedValue'
import { routes } from 'routes'
import { toast } from 'sonner'
import LoadingButton from 'components/commons/LoadingButton'
import { getErrorMessage } from 'utils/errors'
import { markStartedHere } from 'utils/exports'
import ActiveFilters from './ActiveFilters'
import {
  EMPLOYEE_STATUSES,
  EMPLOYEES_PER_PAGE,
  FILTER_KEYS,
  LEAVING_WITHIN_DAYS,
  SEARCH_DEBOUNCE_MS,
} from './constants'
import Filters from './Filters'
import NoticeDialog from './NoticeDialog'
import Pagination from './Pagination'
import Table from './Table'

const Employees = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [noticeDialog, setNoticeDialog] = useState(null)
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const filters = Object.fromEntries(
    FILTER_KEYS.map((key) => [key, searchParams.get(key) ?? '']),
  )
  const debouncedQuery = useDebouncedValue(filters.q.trim(), SEARCH_DEBOUNCE_MS)
  const debouncedMinSalary = useDebouncedValue(
    filters.min_salary.trim(),
    SEARCH_DEBOUNCE_MS,
  )
  const activeFilters = Object.fromEntries(
    Object.entries({
      ...filters,
      q: debouncedQuery,
      min_salary: debouncedMinSalary,
    }).filter(([, value]) => Boolean(value)),
  )
  const hasFilters = Object.values(filters).some(Boolean)
  const { data: departments = [] } = useDepartments()
  const { data: countries = [] } = useCountries({ inUse: true })
  const filterOptions = {
    status: EMPLOYEE_STATUSES.map((status) => ({
      value: status,
      label: t(`employees.status.${status}`),
    })),
    department_id: departments.map(({ id, name }) => ({
      value: id,
      label: name,
    })),
    country: countries.map(({ code, name }) => ({ value: code, label: name })),
    leaving_within: LEAVING_WITHIN_DAYS.map((days) => ({
      value: String(days),
      label: t('employees.filters.leavingWithin', { count: days }),
    })),
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
    updateSearchParams(
      { [key]: value, page: '' },
      { replace: key === 'q' || key === 'min_salary' },
    )

  const clearFilters = () =>
    updateSearchParams(
      Object.fromEntries([...FILTER_KEYS, 'page'].map((key) => [key, ''])),
    )

  const { mutate: createExport, isPending: isStartingExport } =
    useCreateExport()

  const startExport = () =>
    createExport(
      Object.fromEntries(
        Object.entries({ ...filters, q: filters.q.trim() }).filter(
          ([, value]) => Boolean(value),
        ),
      ),
      {
        onSuccess: (created) => markStartedHere(created.id),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )

  const exportButton = (
    <LoadingButton
      variant="outline"
      onClick={startExport}
      loading={isStartingExport}
      disabled={!data || data.meta.total_count === 0}
    >
      <Download />
      {t('exports.actions.export')}
    </LoadingButton>
  )

  const importButton = (
    <Button variant="outline" asChild>
      <Link to={routes.employees.import}>
        <Upload />
        {t('employeeImport.actions.open')}
      </Link>
    </Button>
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
    if (isPending) return <Spinner label={t('employees.list.loading')} />
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
    <div>
      <PageHeader
        title={t('employees.list.title')}
        description={t('employees.list.description')}
        actions={
          <>
            {importButton}
            {exportButton}
            {addButton}
          </>
        }
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
    </div>
  )
}

export default Employees
