import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useLocation } from 'react-router'
import Spinner from 'components/commons/Spinner'
import LoadError from 'components/commons/LoadError'
import { useCurrentUser } from 'hooks/reactQuery/useSession'
import { routes } from 'routes'

const RequireAuth = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { data: user, isPending, isError, error, refetch } = useCurrentUser()

  if (isPending)
    return <Spinner label={t('auth.checking')} className="min-h-svh" />
  if (isError) return <LoadError error={error} onRetry={() => refetch()} />
  if (!user)
    return <Navigate to={routes.login} replace state={{ from: location }} />

  return <Outlet />
}

export default RequireAuth
