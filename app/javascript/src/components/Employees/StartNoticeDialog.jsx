import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ApiError } from 'apis/client'
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
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { useStartNoticePeriod } from 'hooks/reactQuery/useEmployees'
import { getErrorMessage } from 'utils/errors'
import { formatDate } from 'utils/formatDate'
import {
  DAY_IN_MS,
  NOTICE_DAYS_FIELD_ID,
  WHOLE_NUMBER_PATTERN,
} from './constants'
import { fullName } from './utils'

const StartNoticeDialog = ({ employee, settings, onClose }) => {
  const { t } = useTranslation()
  const [days, setDays] = useState(String(settings.notice_period_days))
  const [error, setError] = useState(null)
  const [openedAt] = useState(() => Date.now())
  const { mutate: startNoticePeriod, isPending } = useStartNoticePeriod()

  const parsedDays = Number(days.trim())
  const isValid =
    WHOLE_NUMBER_PATTERN.test(days.trim()) &&
    parsedDays >= 0 &&
    parsedDays <= settings.notice_period_max_days

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isValid) {
      setError(
        t('employees.notice.daysInvalid', {
          max: settings.notice_period_max_days,
        }),
      )
      return
    }

    startNoticePeriod(
      { id: employee.id, days: parsedDays },
      {
        onSuccess: () => {
          toast.success(
            t('employees.notice.started', { name: fullName(employee) }),
          )
          onClose()
        },
        onError: (apiError) => {
          setError(
            apiError instanceof ApiError
              ? Object.values(apiError.details).flat().join(' ') || null
              : null,
          )
          toast.error(getErrorMessage(apiError))
        },
      },
    )
  }

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
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
            <Label htmlFor={NOTICE_DAYS_FIELD_ID}>
              {t('employees.notice.days')}
            </Label>
            <Input
              id={NOTICE_DAYS_FIELD_ID}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={days}
              onChange={(event) => {
                setDays(event.target.value)
                setError(null)
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={`${NOTICE_DAYS_FIELD_ID}-hint`}
              autoFocus
            />
            <p
              id={`${NOTICE_DAYS_FIELD_ID}-hint`}
              className={
                error
                  ? 'text-sm text-destructive first-letter:uppercase'
                  : 'text-sm text-muted-foreground'
              }
            >
              {error ??
                (isValid &&
                  (parsedDays === 0
                    ? t('employees.notice.endsNow')
                    : t('employees.notice.endsOn', {
                        date: formatDate(openedAt + parsedDays * DAY_IN_MS),
                      })))}
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {t('employees.actions.cancel')}
            </AlertDialogCancel>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? t('employees.notice.starting')
                : t('employees.notice.start')}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default StartNoticeDialog
