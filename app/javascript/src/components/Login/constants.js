export const FIELD_IDS = { email: 'login-email', password: 'login-password' }

export const FORM_ERROR_ID = 'login-form-error'

// Deliberately loose: the server is the authority; this only catches obvious typos.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
