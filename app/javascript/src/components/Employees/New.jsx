import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import PageHeader from 'components/commons/PageHeader'
import { useCreateEmployee } from 'hooks/reactQuery/useEmployees'
import { routes } from 'routes'
import { buildUrl } from 'utils/url'
import Form from './Form'

const New = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutateAsync: createEmployee } = useCreateEmployee()

  const handleSubmit = async (payload) => {
    const employee = await createEmployee(payload)
    toast.success(
      t('employees.notices.created', { code: employee.employee_code }),
    )
    navigate(buildUrl(routes.employees.show, { id: employee.id }))
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={t('employees.new.title')}
        description={t('employees.new.description')}
        breadcrumbs={[
          { label: t('nav.employees'), to: routes.employees.index },
          { label: t('employees.new.title') },
        ]}
      />
      <Form
        cancelTo={routes.employees.index}
        onSubmit={handleSubmit}
        submitLabel={t('employees.actions.create')}
      />
    </div>
  )
}

export default New
