import { t } from 'i18next'
import { EMAIL_PATTERN } from 'constants'
import {
  AMOUNT_FIELDS,
  AMOUNT_PATTERN,
  FORM_FIELDS,
  NAME_FIELDS,
  NAME_MAX_LENGTH,
  NOTICE_ACTIONS,
  SALARY_ERROR_PREFIX,
  SALARY_FIELDS,
} from './constants'

export const fieldId = (name) => `employee-${name}`

export const errorId = (name) => `${fieldId(name)}-error`

const formValue = (employee, name) => {
  const value = SALARY_FIELDS.includes(name)
    ? employee?.salary?.[name]
    : employee?.[name]
  if (value == null) return ''

  return AMOUNT_FIELDS.includes(name) ? String(Number(value)) : value
}

export const toFormValues = (employee) =>
  Object.fromEntries(
    FORM_FIELDS.map((name) => [name, formValue(employee, name)]),
  )

export const toPayload = (values) => {
  const trimmed = Object.fromEntries(
    Object.entries(values).map(([name, value]) => [name, value.trim()]),
  )
  const salary = Object.fromEntries(
    SALARY_FIELDS.map((name) => [name, trimmed[name]]),
  )
  const details = Object.fromEntries(
    Object.entries(trimmed).filter(([name]) => !SALARY_FIELDS.includes(name)),
  )

  return { ...details, salary }
}

export const toFieldErrors = (details) =>
  Object.fromEntries(
    Object.entries(details).map(([key, messages]) => [
      key.replace(SALARY_ERROR_PREFIX, ''),
      messages,
    ]),
  )

const fieldError = (name, value) => {
  if (!value) return t('employees.validation.required')
  if (NAME_FIELDS.includes(name) && value.length > NAME_MAX_LENGTH)
    return t('employees.validation.tooLong', { count: NAME_MAX_LENGTH })
  if (name === 'email' && !EMAIL_PATTERN.test(value))
    return t('employees.validation.emailInvalid')
  if (AMOUNT_FIELDS.includes(name) && !AMOUNT_PATTERN.test(value))
    return t('employees.validation.amountInvalid')

  return null
}

export const validateEmployee = (values) =>
  Object.fromEntries(
    FORM_FIELDS.map((name) => [name, fieldError(name, values[name].trim())])
      .filter(([, error]) => error)
      .map(([name, error]) => [name, [error]]),
  )

export const noticeActionFor = (employee) =>
  employee.status === 'active' ? NOTICE_ACTIONS.START : NOTICE_ACTIONS.REMOVE

export const isEditable = (employee) => employee.status !== 'inactive'

export const fullName = (employee) =>
  `${employee.first_name} ${employee.last_name}`

export const initials = (employee) =>
  `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase()
