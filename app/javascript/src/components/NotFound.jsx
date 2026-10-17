import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { routes } from 'routes'

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-16">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        {t('notFound.title')}
      </h1>
      <p className="mb-4">{t('notFound.description')}</p>
      <Link to={routes.root} className="text-primary underline">
        {t('notFound.backHome')}
      </Link>
    </main>
  )
}

export default NotFound
