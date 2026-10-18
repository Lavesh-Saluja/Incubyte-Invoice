import { t } from 'i18next'
import * as yup from 'yup'
import { DEPARTMENT_NAME_MAX_LENGTH } from './constants'

export const departmentSchema = () =>
  yup.object({
    name: yup
      .string()
      .trim()
      .required(t('departments.validation.nameRequired'))
      .max(
        DEPARTMENT_NAME_MAX_LENGTH,
        t('departments.validation.nameTooLong', {
          count: DEPARTMENT_NAME_MAX_LENGTH,
        }),
      ),
  })

export const nameErrors = (details) => ({ name: details?.name?.join(' ') })
