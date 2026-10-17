import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router'
import VersionFooter from 'components/commons/VersionFooter'
import Home from 'components/Home'
import NotFound from 'components/NotFound'
import { routes } from 'routes'

const App = () => {
  const { t } = useTranslation()

  return (
    <>
      <title>{t('app.title')}</title>
      <Routes>
        <Route path={routes.root} element={<Home />} />
        <Route path={routes.notFound} element={<NotFound />} />
      </Routes>
      <VersionFooter />
    </>
  )
}

export default App
