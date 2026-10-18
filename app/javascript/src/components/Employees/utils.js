import { t } from 'i18next'
import * as yup from 'yup'
import { EMAIL_PATTERN } from 'constants'
import {
  AMOUNT_FIELDS,
  AMOUNT_PATTERN,
  ERROR_KEY_ALIASES,
  FORM_FIELDS,
  NAME_MAX_LENGTH,
  NOTICE_ACTIONS,
  PAGE_WINDOW,
  SALARY_ERROR_PREFIX,
  SALARY_FIELDS,
  WHOLE_NUMBER_PATTERN,
} from './constants'

export const fieldId = (name) => `employee-${name}`

const formValue = (employee, name) => {
  if (name === 'department_id') return employee?.department?.id ?? ''

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
      ERROR_KEY_ALIASES[key] ?? key.replace(SALARY_ERROR_PREFIX, ''),
      messages.join(' '),
    ]),
  )

const requiredText = () =>
  yup.string().trim().required(t('employees.validation.required'))

const nameText = () =>
  requiredText().max(
    NAME_MAX_LENGTH,
    t('employees.validation.tooLong', { count: NAME_MAX_LENGTH }),
  )

const amount = () =>
  requiredText().matches(
    AMOUNT_PATTERN,
    t('employees.validation.amountInvalid'),
  )

export const employeeSchema = () =>
  yup.object({
    first_name: nameText(),
    last_name: nameText(),
    email: requiredText().matches(
      EMAIL_PATTERN,
      t('employees.validation.emailInvalid'),
    ),
    job_title: requiredText(),
    department_id: requiredText(),
    country: requiredText(),
    ...Object.fromEntries(AMOUNT_FIELDS.map((name) => [name, amount()])),
    effective_from: requiredText(),
  })

export const noticeDaysSchema = (max) => {
  const message = t('employees.notice.daysInvalid', { max })

  return yup.object({
    days: yup
      .string()
      .trim()
      .required(message)
      .matches(WHOLE_NUMBER_PATTERN, message)
      .test('max', message, (value) => Number(value) <= max),
  })
}

export const noticeActionFor = (employee) =>
  employee.status === 'active' ? NOTICE_ACTIONS.START : NOTICE_ACTIONS.REMOVE

export const isEditable = (employee) => employee.status !== 'inactive'

export const fullName = (employee) =>
  `${employee.first_name} ${employee.last_name}`

export const initials = (employee) =>
  `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase()

export const pageItems = (page, totalPages) => {
  const pages = [...Array(totalPages).keys()]
    .map((index) => index + 1)
    .filter(
      (number) =>
        number === 1 ||
        number === totalPages ||
        Math.abs(number - page) <= PAGE_WINDOW,
    )

  return pages.flatMap((number, index) =>
    index > 0 && number - pages[index - 1] > 1 ? [null, number] : [number],
  )
}
