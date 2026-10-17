import { t } from 'i18next'
import { EMAIL_PATTERN } from 'constants'
import { FORM_FIELDS, NAME_FIELDS, NAME_MAX_LENGTH } from './constants'

export const fieldId = (name) => `employee-${name}`

export const errorId = (name) => `${fieldId(name)}-error`

export const toFormValues = (employee) =>
  Object.fromEntries(
    FORM_FIELDS.map(({ name }) => [name, employee?.[name] ?? '']),
  )

export const toPayload = (values) =>
  Object.fromEntries(
    Object.entries(values).map(([name, value]) => [name, value.trim()]),
  )

export const validateEmployee = (values) => {
  const errors = {}

  FORM_FIELDS.forEach(({ name }) => {
    const value = values[name].trim()

    if (!value) errors[name] = [t('employees.validation.required')]
    else if (NAME_FIELDS.includes(name) && value.length > NAME_MAX_LENGTH)
      errors[name] = [
        t('employees.validation.tooLong', { count: NAME_MAX_LENGTH }),
      ]
    else if (name === 'email' && !EMAIL_PATTERN.test(value))
      errors[name] = [t('employees.validation.emailInvalid')]
  })

  return errors
}

export const fullName = (employee) =>
  `${employee.first_name} ${employee.last_name}`
