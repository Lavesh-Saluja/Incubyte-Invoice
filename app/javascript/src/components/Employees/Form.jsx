import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { ApiError } from 'apis/client'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { useCountries } from 'hooks/reactQuery/useCountries'
import { getErrorMessage } from 'utils/errors'
import { AMOUNT_FIELDS, DETAIL_FIELDS } from './constants'
import CountrySelect from './CountrySelect'
import {
  errorId,
  fieldId,
  toFieldErrors,
  toFormValues,
  toPayload,
  validateEmployee,
} from './utils'

const Section = ({ title, description, children }) => (
  <section className="flex flex-col gap-5">
    <div>
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="grid gap-5 sm:grid-cols-2">{children}</div>
  </section>
)

const Field = ({ name, label, errors, children }) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={fieldId(name)}>{label}</Label>
    {children}
    {errors?.[name] && (
      <p
        id={errorId(name)}
        className="text-sm text-destructive first-letter:uppercase"
      >
        {errors[name].join(' ')}
      </p>
    )}
  </div>
)

const Form = ({
  employee = null,
  cancelTo,
  onSubmit,
  submitLabel,
  submittingLabel,
}) => {
  const { t } = useTranslation()
  const { data: countries } = useCountries()
  const [values, setValues] = useState(() => toFormValues(employee))
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const currency = countries?.find(
    (country) => country.code === values.country,
  )?.currency

  const setValue = (name, value) =>
    setValues((current) => ({ ...current, [name]: value }))

  const ariaFor = (name) => ({
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? errorId(name) : undefined,
  })

  const inputProps = (name) => ({
    id: fieldId(name),
    name,
    value: values[name],
    onChange: (event) => setValue(name, event.target.value),
    ...ariaFor(name),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    const clientErrors = validateEmployee(values)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await onSubmit(toPayload(values))
    } catch (error) {
      setErrors(error instanceof ApiError ? toFieldErrors(error.details) : {})
      toast.error(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <Section
        title={t('employees.form.detailsTitle')}
        description={t('employees.form.detailsDescription')}
      >
        {DETAIL_FIELDS.map(({ name, type = 'text', autoComplete }) => (
          <Field
            key={name}
            name={name}
            label={t(`employees.fields.${name}`)}
            errors={errors}
          >
            <Input
              type={type}
              autoComplete={autoComplete}
              {...inputProps(name)}
            />
          </Field>
        ))}
        <Field
          name="country"
          label={t('employees.fields.country')}
          errors={errors}
        >
          <CountrySelect
            id={fieldId('country')}
            value={values.country}
            countries={countries}
            onChange={(code) => setValue('country', code)}
            {...ariaFor('country')}
          />
        </Field>
      </Section>

      <div className="border-t" />

      <Section
        title={t('employees.form.salaryTitle')}
        description={
          currency
            ? t('employees.form.salaryDescription', { currency })
            : t('employees.form.salaryNoCountry')
        }
      >
        {AMOUNT_FIELDS.map((name) => (
          <Field
            key={name}
            name={name}
            label={t(`employees.salary.${name}`)}
            errors={errors}
          >
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                {currency ?? '—'}
              </span>
              <Input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                className="pl-14"
                {...inputProps(name)}
              />
            </div>
          </Field>
        ))}
        <Field
          name="effective_from"
          label={t('employees.salary.effective_from')}
          errors={errors}
        >
          <Input type="date" {...inputProps('effective_from')} />
        </Field>
      </Section>

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
