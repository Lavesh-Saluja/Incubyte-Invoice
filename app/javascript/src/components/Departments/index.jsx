import { Building, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EmptyState from 'components/commons/EmptyState'
import LoadError from 'components/commons/LoadError'
import PageHeader from 'components/commons/PageHeader'
import Spinner from 'components/commons/Spinner'
import { Button } from 'components/ui/button'
import { Card } from 'components/ui/card'
import { useFetchDepartments } from 'hooks/reactQuery/useDepartments'
import AddDialog from './AddDialog'
import StatsTable from './StatsTable'

const Departments = () => {
  const { t } = useTranslation()
  const [adding, setAdding] = useState(false)
  const {
    data: departments,
    isPending,
    isError,
    error,
    refetch,
  } = useFetchDepartments()

  const addButton = (
    <Button onClick={() => setAdding(true)}>
      <Plus />
      {t('departments.actions.add')}
    </Button>
  )

  const renderContent = () => {
    if (isPending) return <Spinner label={t('departments.loading')} />
    if (isError) return <LoadError error={error} onRetry={() => refetch()} />
    if (departments.length === 0)
      return (
        <EmptyState
          icon={Building}
          title={t('departments.emptyTitle')}
          description={t('departments.emptyDescription')}
          action={addButton}
        />
      )

    return (
      <StatsTable
        rows={departments}
        headcount={departments.reduce((sum, row) => sum + row.current, 0)}
      />
    )
  }

  return (
    <div>
      <PageHeader
        title={t('departments.title')}
        description={t('departments.description')}
        actions={addButton}
      />
      <Card className="gap-0 overflow-hidden py-0">{renderContent()}</Card>
      <AddDialog open={adding} onOpenChange={setAdding} />
    </div>
  )
}

export default Departments
