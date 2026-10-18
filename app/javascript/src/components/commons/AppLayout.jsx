import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet } from 'react-router'
import { cn } from 'cn'
import LoadingButton from 'components/commons/LoadingButton'
import { useCurrentUser, useLogout } from 'hooks/reactQuery/useSession'
import { routes } from 'routes'

const NAV_ITEMS = [
  { to: routes.root, labelKey: 'nav.home', end: true },
  { to: routes.employees.index, labelKey: 'nav.employees' },
]
import { getErrorMessage } from 'utils/errors'

const AppLayout = () => {
  const { t } = useTranslation()
  const { data: user } = useCurrentUser()
  const logout = useLogout()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <Link to={routes.root} className="font-semibold">
              {t('app.name')}
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              {NAV_ITEMS.map(({ to, labelKey, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      isActive &&
                        'bg-accent font-medium text-accent-foreground',
                    )
                  }
                >
                  {t(labelKey)}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {logout.isError && (
              <span role="alert" className="text-destructive">
                {getErrorMessage(logout.error)}
              </span>
            )}
            <span className="hidden text-muted-foreground sm:inline">
              {user?.name}
            </span>
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => logout.mutate()}
              loading={logout.isPending}
            >
              {t('header.logout')}
            </LoadingButton>
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
