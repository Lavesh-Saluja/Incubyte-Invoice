import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { ApiError } from 'apis/client'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { getErrorMessage } from 'utils/errors'
import { FORM_FIELDS } from './constants'
import {
  errorId,
  fieldId,
  toFormValues,
  toPayload,
  validateEmployee,
} from './utils'

const Form = ({
  employee = null,
  cancelTo,
  onSubmit,
  submitLabel,
  submittingLabel,
}) => {
  const { t } = useTranslation()
  const [values, setValues] = useState(() => toFormValues(employee))
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const clientErrors = validateEmployee(values)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await onSubmit(toPayload(values))
    } catch (error) {
      setErrors(error instanceof ApiError ? error.details : {})
      toast.error(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {FORM_FIELDS.map(({ name, type = 'text', autoComplete }) => (
          <div key={name} className="flex flex-col gap-2">
            <Label htmlFor={fieldId(name)}>
              {t(`employees.fields.${name}`)}
            </Label>
            <Input
              id={fieldId(name)}
              name={name}
              type={type}
              autoComplete={autoComplete}
              value={values[name]}
              onChange={handleChange}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={errors[name] ? errorId(name) : undefined}
            />
            {errors[name] && (
              <p
                id={errorId(name)}
                className="text-sm text-destructive first-letter:uppercase"
              >
                {errors[name].join(' ')}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 border-t pt-6">
        <Button variant="outline" asChild>
          <Link to={cancelTo}>{t('employees.actions.cancel')}</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default Form
