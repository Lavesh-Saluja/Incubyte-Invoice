import { useTranslation } from 'react-i18next'
import { Button } from 'components/ui/button'
import { getErrorMessage } from 'utils/errors'

const LoadError = ({ error, onRetry }) => {
  const { t } = useTranslation()

  return (
    <div
      role="alert"
      className="mx-auto my-8 max-w-md rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm"
    >
      <p className="mb-3 text-destructive">{getErrorMessage(error)}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        {t('common.retry')}
      </Button>
    </div>
  )
}

export default LoadError
