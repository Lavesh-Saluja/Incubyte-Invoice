import { t } from 'i18next'
import { EMAIL_PATTERN } from './constants'

export const errorId = (fieldId) => `${fieldId}-error`

// Returns { field: message } for invalid fields; empty when the form can be submitted.
export const validateCredentials = ({ email, password }) => {
  const errors = {}
  const trimmedEmail = email.trim()

  if (!trimmedEmail) errors.email = t('login.validation.emailRequired')
  else if (!EMAIL_PATTERN.test(trimmedEmail))
    errors.email = t('login.validation.emailInvalid')
  if (!password) errors.password = t('login.validation.passwordRequired')

  return errors
}
