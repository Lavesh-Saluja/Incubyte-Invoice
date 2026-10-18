export const DEFAULT_LOCALE = 'en'

// Commit this frontend was built from (see vite.config.js); empty in development.
export const APP_REVISION = import.meta.env.VITE_APP_REVISION ?? ''

export const SHORT_REVISION_LENGTH = 7

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const DATE_FORMAT = { dateStyle: 'medium' }

export const DATE_TIME_FORMAT = { dateStyle: 'medium', timeStyle: 'short' }

export const CURRENCY_LOCALES = { INR: 'en-IN' }

export const TOAST_TOP_OFFSET = '4.5rem'
