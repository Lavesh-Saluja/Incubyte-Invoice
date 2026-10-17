import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useLocation } from 'react-router'
import FullPageStatus from 'components/commons/FullPageStatus'
import LoadError from 'components/commons/LoadError'
import { useCurrentUser } from 'hooks/reactQuery/useSession'
import { routes } from 'routes'

const RequireAuth = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { data: user, isPending, isError, error, refetch } = useCurrentUser()

  if (isPending) return <FullPageStatus>{t('auth.checking')}</FullPageStatus>
  if (isError) return <LoadError error={error} onRetry={() => refetch()} />
  if (!user)
    return <Navigate to={routes.login} replace state={{ from: location }} />

  return <Outlet />
}

export default RequireAuth
