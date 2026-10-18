import { t } from 'i18next'
import * as yup from 'yup'
import { EMAIL_PATTERN } from 'constants'

export const loginSchema = () =>
  yup.object({
    email: yup
      .string()
      .trim()
      .required(t('login.validation.emailRequired'))
      .matches(EMAIL_PATTERN, t('login.validation.emailInvalid')),
    password: yup.string().required(t('login.validation.passwordRequired')),
  })
