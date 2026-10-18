export const NAME_MAX_LENGTH = 100

export const FORM_FIELDS = [
  { name: 'first_name', autoComplete: 'given-name' },
  { name: 'last_name', autoComplete: 'family-name' },
  { name: 'email', type: 'email', autoComplete: 'email' },
  { name: 'job_title', autoComplete: 'organization-title' },
  { name: 'department', autoComplete: 'off' },
  { name: 'country', autoComplete: 'country-name' },
]

export const NAME_FIELDS = ['first_name', 'last_name']

export const STATUS_BADGE_CLASSES = {
  active: 'border-success/20 bg-success-surface text-success',
  notice_period: 'border-warning/30 bg-warning-surface text-warning',
  inactive: 'border-destructive/20 bg-destructive-surface text-destructive',
}

export const EMPLOYEES_PER_PAGE = 25

export const NOTICE_ACTIONS = { START: 'start', REMOVE: 'remove' }

export const NOTICE_DAYS_FIELD_ID = 'notice-period-days'

export const DAY_IN_MS = 24 * 60 * 60 * 1000

export const WHOLE_NUMBER_PATTERN = /^\d+$/
