import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'
import { Button } from 'components/ui/button'
import { useCurrentUser, useLogout } from 'hooks/reactQuery/useSession'
import { getErrorMessage } from 'utils/errors'

const AppLayout = () => {
  const { t } = useTranslation()
  const { data: user } = useCurrentUser()
  const logout = useLogout()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <span className="font-semibold">{t('app.name')}</span>
          <div className="flex items-center gap-3 text-sm">
            {logout.isError && (
              <span role="alert" className="text-destructive">
                {getErrorMessage(logout.error)}
              </span>
            )}
            <span className="hidden text-muted-foreground sm:inline">
              {user?.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              {logout.isPending ? t('header.loggingOut') : t('header.logout')}
            </Button>
          </div>
        </div>
      </header>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
