import { useTranslation } from 'react-i18next'
import PageHeader from 'components/commons/PageHeader'

const Home = () => {
  const { t } = useTranslation()

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader title={t('home.title')} description={t('home.subtitle')} />
    </main>
  )
}

export default Home
