export const STATUS_COLUMNS = [
  { key: 'active', filters: { status: 'active' } },
  { key: 'notice_period', filters: { status: 'notice_period' } },
  { key: 'inactive', filters: { status: 'inactive' } },
  { key: 'current', filters: {} },
]

export const DASHBOARD_COLUMNS = STATUS_COLUMNS.filter(
  ({ key }) => key !== 'inactive',
)

export const DEPARTMENT_NAME_FIELD_ID = 'department-name'

export const DEPARTMENT_NAME_MAX_LENGTH = 100
