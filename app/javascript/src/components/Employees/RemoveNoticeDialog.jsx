import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'components/ui/alert-dialog'
import { Button } from 'components/ui/button'
import { useRemoveNoticePeriod } from 'hooks/reactQuery/useEmployees'
import { getErrorMessage } from 'utils/errors'
import { fullName } from './utils'

const RemoveNoticeDialog = ({ employee, onClose }) => {
  const { t } = useTranslation()
  const { mutate: removeNoticePeriod, isPending } = useRemoveNoticePeriod()
  const name = fullName(employee)

  const handleConfirm = () =>
    removeNoticePeriod(employee.id, {
      onSuccess: () => {
        toast.success(t('employees.notice.removed', { name }))
        onClose()
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    })

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('employees.notice.removeTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(`employees.notice.removeDescription.${employee.status}`, {
              name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t('employees.actions.cancel')}
          </AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending
              ? t('employees.notice.removing')
              : t('employees.notice.remove')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RemoveNoticeDialog
