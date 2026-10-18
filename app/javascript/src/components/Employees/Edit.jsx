import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import LoadError from 'components/commons/LoadError'
import Spinner from 'components/commons/Spinner'
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
      return <Spinner label={t('employees.loading')} className="min-h-[60vh]" />
    if (isError) return <LoadError error={error} onRetry={() => refetch()} />

    return (
      <>
        <PageHeader
          title={t('employees.edit.title')}
          description={
            <span className="flex items-center gap-2">
              {fullName(employee)}
              <span aria-hidden="true">{t('common.separator')}</span>
              <span className="tabular-nums">{employee.employee_code}</span>
              <StatusBadge status={employee.status} />
            </span>
          }
          breadcrumbs={[
            { label: t('nav.employees'), to: routes.employees.index },
            { label: fullName(employee), to: showPath },
            { label: t('employees.edit.title') },
          ]}
        />
        {isEditable(employee) ? (
          <Form
            employee={employee}
            cancelTo={showPath}
            onSubmit={handleSubmit}
            submitLabel={t('employees.actions.save')}
          />
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

  return <div className="mx-auto max-w-4xl">{renderContent()}</div>
}

export default Edit
