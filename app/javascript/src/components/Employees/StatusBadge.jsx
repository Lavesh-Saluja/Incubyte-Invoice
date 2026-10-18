import { useTranslation } from 'react-i18next'
import { Badge } from 'components/ui/badge'
import { STATUS_BADGE_VARIANTS } from './constants'

const StatusBadge = ({ status }) => {
  const { t } = useTranslation()

  return (
    <Badge variant={STATUS_BADGE_VARIANTS[status]}>
      {t(`employees.status.${status}`)}
    </Badge>
  )
}

export default StatusBadge
