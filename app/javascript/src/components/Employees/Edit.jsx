import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import LoadError from 'components/commons/LoadError'
import PageHeader from 'components/commons/PageHeader'
import { Card, CardContent } from 'components/ui/card'
import {
  useShowEmployee,
  useUpdateEmployee,
} from 'hooks/reactQuery/useEmployees'
import { routes } from 'routes'
import { buildUrl } from 'utils/url'
import StatusBadge from './StatusBadge'
import Form from './Form'
import { fullName, isEditable } from './utils'

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
  const showPath = buildUrl(routes.employees.show, { id })

  const handleSubmit = async (payload) => {
    await updateEmployee({ id, payload })
    toast.success(t('employees.notices.updated'))
    navigate(showPath)
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
              <StatusBadge status={employee.status} />
            </span>
          }
        />
        {isEditable(employee) ? (
          <Card>
            <CardContent>
              <Form
                employee={employee}
                cancelTo={showPath}
                onSubmit={handleSubmit}
                submitLabel={t('employees.actions.save')}
                submittingLabel={t('employees.actions.saving')}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-sm">
              <p className="text-muted-foreground">
                {t('employees.edit.inactive')}
              </p>
              <Link
                to={showPath}
                className="mt-3 inline-block text-primary underline"
              >
                {t('employees.edit.viewEmployee')}
              </Link>
            </CardContent>
          </Card>
        )}
      </>
    )
  }

  return <main className="mx-auto max-w-3xl px-4 py-8">{renderContent()}</main>
}

export default Edit
