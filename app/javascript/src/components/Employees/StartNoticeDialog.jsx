import { Form, Formik, useFormikContext } from 'formik'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ApiError } from 'apis/client'
import Callout from 'components/commons/Callout'
import FormField from 'components/commons/FormField'
import SubmitButton from 'components/commons/SubmitButton'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'components/ui/alert-dialog'
import { Input } from 'components/ui/input'
import { useStartNoticePeriod } from 'hooks/reactQuery/useEmployees'
import { getErrorMessage } from 'utils/errors'
import { formatDate } from 'utils/formatDate'
import { DAY_IN_MS, NOTICE_DAYS_FIELD_ID } from './constants'
import { fullName, noticeDaysSchema, toFieldErrors } from './utils'

const EndDateHint = ({ openedAt }) => {
  const { t } = useTranslation()
  const { values, errors } = useFormikContext()
  if (errors.days) return null

  const days = Number(values.days)

  return (
    <p className="text-[13px] text-muted-foreground">
      {days === 0 ? (
        t('employees.notice.endsNow')
      ) : (
        <Trans
          i18nKey="employees.notice.endsOn"
          values={{ date: formatDate(openedAt + days * DAY_IN_MS) }}
          components={{
            strong: <strong className="font-medium text-foreground" />,
          }}
        />
      )}
    </p>
  )
}

const StartNoticeDialog = ({ employee, settings, onClose }) => {
  const { t } = useTranslation()
  const [openedAt] = useState(() => Date.now())
  const { mutateAsync: startNoticePeriod } = useStartNoticePeriod()

  const handleSubmit = async ({ days }, { setErrors }) => {
    try {
      await startNoticePeriod({ id: employee.id, days: Number(days.trim()) })
      toast.success(t('employees.notice.started', { name: fullName(employee) }))
      onClose()
    } catch (error) {
      if (error instanceof ApiError) setErrors(toFieldErrors(error.details))
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <Formik
          initialValues={{ days: String(settings.notice_period_days) }}
          validationSchema={noticeDaysSchema(settings.notice_period_max_days)}
          validateOnMount
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form noValidate className="grid gap-4">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('employees.notice.startTitle')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('employees.notice.startDescription', {
                    name: fullName(employee),
                  })}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="flex flex-col gap-2">
                <FormField
                  name="days"
                  id={NOTICE_DAYS_FIELD_ID}
                  label={t('employees.notice.days')}
                >
                  {({ field, ariaProps }) => (
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        autoFocus
                        className="pr-14 tabular-nums"
                        {...field}
                        {...ariaProps}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                        {t('employees.notice.daysUnit')}
                      </span>
                    </div>
                  )}
                </FormField>
                <EndDateHint openedAt={openedAt} />
              </div>

              <Callout tone="warning">
                {t('employees.notice.consequence')}
              </Callout>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>
                  {t('employees.actions.cancel')}
                </AlertDialogCancel>
                <SubmitButton requireChanges={false} variant="destructive">
                  {t('employees.notice.start')}
                </SubmitButton>
              </AlertDialogFooter>
            </Form>
          )}
        </Formik>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default StartNoticeDialog
