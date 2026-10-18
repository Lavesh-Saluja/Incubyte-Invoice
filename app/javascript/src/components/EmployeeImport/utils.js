import { BYTES_PER_KB, BYTES_PER_MB } from './constants'
import { formatCurrency } from 'utils/formatCurrency'

export const previewAmount = ({ annual_ctc: value, currency }) => {
  try {
    return formatCurrency(value, currency)
  } catch {
    return value
  }
}

export const importFailure = (error) => error?.payload?.import

export const fileProblem = (message) => ({
  valid: false,
  total_rows: 0,
  valid_rows: 0,
  invalid_rows: 0,
  errors_count: 1,
  errors: [{ row: null, column: null, message }],
  preview: [],
})

export const formatFileSize = (bytes) => {
  const unit = bytes < BYTES_PER_MB ? 'kilobyte' : 'megabyte'
  return new Intl.NumberFormat(undefined, {
    style: 'unit',
    unit,
    maximumFractionDigits: 1,
  }).format(bytes / (unit === 'kilobyte' ? BYTES_PER_KB : BYTES_PER_MB))
}

export const isTooLarge = (file, maxMb) =>
  Boolean(maxMb) && file.size > maxMb * BYTES_PER_MB
