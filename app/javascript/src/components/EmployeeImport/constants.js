export const IMPORT_COLUMNS = [
  'employee_code',
  'first_name',
  'last_name',
  'email',
  'job_title',
  'department',
  'country',
  'status',
  'notice_period_start_date',
  'notice_period_end_date',
  'currency',
  'annual_ctc',
  'annual_base_pay',
  'annual_pf',
  'annual_other_components',
]

export const CONDITIONAL_COLUMNS = [
  'notice_period_start_date',
  'notice_period_end_date',
]

export const SUMMARY_TILES = [
  { key: 'total_rows', tone: 'text-foreground' },
  { key: 'valid_rows', tone: 'text-success' },
  { key: 'invalid_rows', tone: 'text-destructive' },
]

export const IMPORT_STEPS = {
  choose: 'choose',
  checking: 'checking',
  checked: 'checked',
  done: 'done',
}

export const PREVIEW_COLUMNS = [
  'row',
  'employee',
  'department',
  'country',
  'status',
  'annual_ctc',
]

export const BYTES_PER_KB = 1024

export const BYTES_PER_MB = 1024 * 1024
