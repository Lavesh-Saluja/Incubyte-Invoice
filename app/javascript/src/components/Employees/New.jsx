import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import PageHeader from 'components/commons/PageHeader'
import { Card, CardContent } from 'components/ui/card'
import { useCreateEmployee } from 'hooks/reactQuery/useEmployees'
import { routes } from 'routes'
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
    navigate(routes.employees.index)
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        title={t('employees.new.title')}
        description={t('employees.new.description')}
      />
      <Card>
        <CardContent>
          <Form
            onSubmit={handleSubmit}
            submitLabel={t('employees.actions.create')}
            submittingLabel={t('employees.actions.creating')}
          />
        </CardContent>
      </Card>
    </main>
  )
}

export default New
