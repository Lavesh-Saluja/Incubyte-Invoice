import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router'
import AppLayout from 'components/commons/AppLayout'
import RequireAuth from 'components/commons/RequireAuth'
import Dashboard from 'components/Dashboard'
import Departments from 'components/Departments'
import Exports from 'components/Exports'
import Employees from 'components/Employees'
import EditEmployee from 'components/Employees/Edit'
import NewEmployee from 'components/Employees/New'
import ShowEmployee from 'components/Employees/Show'
import Login from 'components/Login'
import NotFound from 'components/NotFound'
import { Toaster } from 'components/ui/sonner'
import { TOAST_TOP_OFFSET } from 'constants'
import { routes } from 'routes'

const App = () => {
  const { t } = useTranslation()

  return (
    <>
      <title>{t('app.title')}</title>
      <Routes>
        <Route path={routes.login} element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path={routes.root} element={<Dashboard />} />
            <Route path={routes.departments.index} element={<Departments />} />
            <Route path={routes.exports.index} element={<Exports />} />
            <Route path={routes.employees.index} element={<Employees />} />
            <Route path={routes.employees.new} element={<NewEmployee />} />
            <Route path={routes.employees.show} element={<ShowEmployee />} />
            <Route path={routes.employees.edit} element={<EditEmployee />} />
          </Route>
        </Route>
        <Route path={routes.notFound} element={<NotFound />} />
      </Routes>
      <Toaster
        position="top-center"
        offset={{ top: TOAST_TOP_OFFSET }}
        mobileOffset={{ top: TOAST_TOP_OFFSET }}
      />
    </>
  )
}

export default App
