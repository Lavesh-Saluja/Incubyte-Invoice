import { useTranslation } from 'react-i18next'
import { cn } from 'cn'
import { STATUS_STYLES } from './constants'

const StatusBadge = ({ status }) => {
  const { t } = useTranslation()
  const { pill, dot } = STATUS_STYLES[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        pill,
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', dot)} />
      {t(`employees.status.${status}`)}
    </span>
  )
}

export default StatusBadge
