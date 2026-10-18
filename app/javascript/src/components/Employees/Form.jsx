import { Form as FormikForm, Formik, useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { ApiError } from 'apis/client'
import FormField from 'components/commons/FormField'
import SubmitButton from 'components/commons/SubmitButton'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { useCountries } from 'hooks/reactQuery/useSelectOptions'
import { getErrorMessage } from 'utils/errors'
import { AMOUNT_FIELDS, DETAIL_FIELDS } from './constants'
import CountrySelect from './CountrySelect'
import {
  employeeSchema,
  fieldId,
  toFieldErrors,
  toFormValues,
  toPayload,
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

const Fields = ({ countries, cancelTo, submitLabel }) => {
  const { t } = useTranslation()
  const { values } = useFormikContext()
  const currency = countries?.find(
    (country) => country.code === values.country,
  )?.currency

  return (
    <FormikForm noValidate className="flex flex-col gap-8">
      <Section
        title={t('employees.form.detailsTitle')}
        description={t('employees.form.detailsDescription')}
      >
        {DETAIL_FIELDS.map(({ name, type = 'text', autoComplete }) => (
          <FormField
            key={name}
            name={name}
            id={fieldId(name)}
            label={t(`employees.fields.${name}`)}
            type={type}
            autoComplete={autoComplete}
          />
        ))}
        <FormField
          name="country"
          id={fieldId('country')}
          label={t('employees.fields.country')}
        >
          {({ field, helpers, ariaProps }) => (
            <CountrySelect
              value={field.value}
              countries={countries}
              onChange={(code) => helpers.setValue(code)}
              onClose={() => helpers.setTouched(true)}
              {...ariaProps}
            />
          )}
        </FormField>
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
          <FormField
            key={name}
            name={name}
            id={fieldId(name)}
            label={t(`employees.salary.${name}`)}
          >
            {({ field, ariaProps }) => (
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                  {currency ?? '—'}
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  className="pl-14"
                  {...field}
                  {...ariaProps}
                />
              </div>
            )}
          </FormField>
        ))}
        <FormField
          name="effective_from"
          id={fieldId('effective_from')}
          label={t('employees.salary.effective_from')}
          type="date"
        />
      </Section>

      <div className="flex justify-end gap-2 border-t pt-6">
        <Button variant="outline" asChild>
          <Link to={cancelTo}>{t('employees.actions.cancel')}</Link>
        </Button>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </FormikForm>
  )
}

const Form = ({ employee = null, cancelTo, onSubmit, submitLabel }) => {
  const { data: countries } = useCountries()

  const handleSubmit = async (values, { setErrors }) => {
    try {
      await onSubmit(toPayload(values))
    } catch (error) {
      if (error instanceof ApiError) setErrors(toFieldErrors(error.details))
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Formik
      initialValues={toFormValues(employee)}
      validationSchema={employeeSchema()}
      validateOnMount
      onSubmit={handleSubmit}
    >
      <Fields
        countries={countries}
        cancelTo={cancelTo}
        submitLabel={submitLabel}
      />
    </Formik>
  )
}

export default Form
