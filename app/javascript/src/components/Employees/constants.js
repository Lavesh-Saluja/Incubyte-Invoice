export const NAME_MAX_LENGTH = 100

export const DETAIL_FIELDS = [
  { name: 'first_name', autoComplete: 'given-name' },
  { name: 'last_name', autoComplete: 'family-name' },
  { name: 'email', type: 'email', autoComplete: 'email' },
  { name: 'job_title', autoComplete: 'organization-title' },
  { name: 'department', autoComplete: 'off' },
]

export const AMOUNT_FIELDS = [
  'annual_ctc',
  'annual_base_pay',
  'annual_pf',
  'annual_other_components',
]

export const SALARY_FIELDS = [...AMOUNT_FIELDS, 'effective_from']

export const FORM_FIELDS = [
  ...DETAIL_FIELDS.map(({ name }) => name),
  'country',
  ...SALARY_FIELDS,
]

export const SALARY_ERROR_PREFIX = 'salary.'

export const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/

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

export const FILTER_KEYS = ['q', 'status', 'department', 'country']

export const ALL_OPTION = 'all'

export const SEARCH_DEBOUNCE_MS = 300

export const EMPLOYEE_STATUSES = ['active', 'notice_period', 'inactive']
