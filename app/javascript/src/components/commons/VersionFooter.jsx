import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { APP_REVISION } from 'constants'
import { useFetchApiHealth } from 'hooks/reactQuery/useHealth'
import { shortRevision } from 'utils/revision'

const VersionFooter = () => {
  const { t } = useTranslation()
  const { data, isPending, isError } = useFetchApiHealth()

  if (isPending)
    return (
      <footer className="flex justify-center px-4 pb-6">
        <Loader2
          aria-label={t('version.checking')}
          className="size-4 animate-spin text-muted-foreground"
        />
      </footer>
    )

  return (
    <footer className="px-4 pb-6 text-center text-xs text-muted-foreground">
      {t('version.summary', {
        web: shortRevision(APP_REVISION) ?? t('version.development'),
        api: isError
          ? t('version.unavailable')
          : (shortRevision(data.revision) ?? t('version.development')),
      })}
    </footer>
  )
}

export default VersionFooter
