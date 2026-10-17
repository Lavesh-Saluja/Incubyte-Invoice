import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import LoadError from 'components/commons/LoadError'
import PageHeader from 'components/commons/PageHeader'
import { Badge } from 'components/ui/badge'
import { Card, CardContent } from 'components/ui/card'
import {
  useShowEmployee,
  useUpdateEmployee,
} from 'hooks/reactQuery/useEmployees'
import { routes } from 'routes'
import { STATUS_BADGE_VARIANTS } from './constants'
import Form from './Form'
import { fullName } from './utils'

const Edit = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const {
    data: employee,
    isPending,
    isError,
    error,
    refetch,
  } = useShowEmployee(id)
  const { mutateAsync: updateEmployee } = useUpdateEmployee()

  const handleSubmit = async (payload) => {
    await updateEmployee({ id, payload })
    toast.success(t('employees.notices.updated'))
    navigate(routes.employees.index)
  }

  const renderContent = () => {
    if (isPending)
      return (
        <p role="status" className="text-sm text-muted-foreground">
          {t('employees.loading')}
        </p>
      )
    if (isError) return <LoadError error={error} onRetry={() => refetch()} />

    return (
      <>
        <PageHeader
          title={fullName(employee)}
          description={
            <span className="flex items-center gap-2">
              <span className="font-mono">{employee.employee_code}</span>
              <Badge variant={STATUS_BADGE_VARIANTS[employee.status]}>
                {t(`employees.status.${employee.status}`)}
              </Badge>
            </span>
          }
        />
        <Card>
          <CardContent>
            <Form
              employee={employee}
              onSubmit={handleSubmit}
              submitLabel={t('employees.actions.save')}
              submittingLabel={t('employees.actions.saving')}
            />
          </CardContent>
        </Card>
      </>
    )
  }

  return <main className="mx-auto max-w-3xl px-4 py-8">{renderContent()}</main>
}

export default Edit
