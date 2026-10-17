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

export const STATUS_BADGE_VARIANTS = {
  active: 'default',
  notice_period: 'outline',
  inactive: 'secondary',
}

export const EMPLOYEES_PER_PAGE = 25
