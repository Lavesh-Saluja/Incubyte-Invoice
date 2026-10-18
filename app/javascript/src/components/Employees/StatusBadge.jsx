import { useTranslation } from 'react-i18next'
import { Badge } from 'components/ui/badge'
import { STATUS_BADGE_CLASSES } from './constants'

const StatusBadge = ({ status }) => {
  const { t } = useTranslation()

  return (
    <Badge variant="outline" className={STATUS_BADGE_CLASSES[status]}>
      {t(`employees.status.${status}`)}
    </Badge>
  )
}

export default StatusBadge
