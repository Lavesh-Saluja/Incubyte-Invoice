import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation()

  return (
    <main className="mx-auto max-w-5xl px-4 pt-8 pb-16">
      <h1 className="mb-2 text-3xl font-bold">{t('home.title')}</h1>
      <p className="text-gray-600">{t('home.subtitle')}</p>
    </main>
  )
}

export default Home
