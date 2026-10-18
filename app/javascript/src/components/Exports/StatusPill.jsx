import { useTranslation } from 'react-i18next'
import { cn } from 'cn'
import { EXPORT_STATUS_STYLES } from './constants'

const StatusPill = ({ status, progress }) => {
  const { t } = useTranslation()

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        EXPORT_STATUS_STYLES[status],
      )}
    >
      {status === 'processing'
        ? t('exports.statuses.processingProgress', { progress })
        : t(`exports.statuses.${status}`)}
    </span>
  )
}

export default StatusPill
