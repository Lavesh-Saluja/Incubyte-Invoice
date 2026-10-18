import { Compass } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import EmptyState from 'components/commons/EmptyState'
import { Button } from 'components/ui/button'
import { routes } from 'routes'

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <h1 className="sr-only">{t('notFound.title')}</h1>
      <EmptyState
        icon={Compass}
        title={t('notFound.title')}
        description={t('notFound.description')}
        action={
          <Button asChild>
            <Link to={routes.root}>{t('notFound.backHome')}</Link>
          </Button>
        }
      />
    </main>
  )
}

export default NotFound
