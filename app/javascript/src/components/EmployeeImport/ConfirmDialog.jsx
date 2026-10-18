import { useTranslation } from 'react-i18next'
import LoadingButton from 'components/commons/LoadingButton'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'components/ui/alert-dialog'
import { formatNumber } from 'utils/formatNumber'

const ConfirmDialog = ({ count, open, importing, onConfirm, onClose }) => {
  const { t } = useTranslation()
  const values = { count: formatNumber(count) }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('employeeImport.confirm.title', values)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('employeeImport.confirm.description', values)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={importing}>
            {t('employeeImport.actions.cancel')}
          </AlertDialogCancel>
          <LoadingButton onClick={onConfirm} loading={importing}>
            {t('employeeImport.actions.import', values)}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmDialog
