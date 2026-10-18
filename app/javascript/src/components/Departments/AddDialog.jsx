import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ApiError } from 'apis/client'
import FormField from 'components/commons/FormField'
import SubmitButton from 'components/commons/SubmitButton'
import { Button } from 'components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog'
import { useCreateDepartment } from 'hooks/reactQuery/useDepartments'
import { getErrorMessage } from 'utils/errors'
import { DEPARTMENT_NAME_FIELD_ID } from './constants'
import { departmentSchema, nameErrors } from './utils'

const AddDialog = ({ open, onOpenChange }) => {
  const { t } = useTranslation()
  const { mutateAsync: createDepartment } = useCreateDepartment()

  const handleSubmit = async ({ name }, { setErrors }) => {
    try {
      const department = await createDepartment({ name: name.trim() })
      toast.success(t('departments.notices.created', { name: department.name }))
      onOpenChange(false)
    } catch (error) {
      if (error instanceof ApiError) setErrors(nameErrors(error.details))
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="bg-card">
        <Formik
          initialValues={{ name: '' }}
          validationSchema={departmentSchema()}
          validateOnMount
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form noValidate className="grid gap-5">
              <DialogHeader>
                <DialogTitle>{t('departments.add.title')}</DialogTitle>
                <DialogDescription>
                  {t('departments.add.description')}
                </DialogDescription>
              </DialogHeader>
              <FormField
                name="name"
                id={DEPARTMENT_NAME_FIELD_ID}
                label={t('departments.fields.name')}
                autoComplete="off"
                autoFocus
                required
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={isSubmitting}>
                    {t('departments.actions.cancel')}
                  </Button>
                </DialogClose>
                <SubmitButton>{t('departments.actions.add')}</SubmitButton>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AddDialog
