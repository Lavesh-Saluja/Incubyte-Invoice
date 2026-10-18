import { ChevronDown, Loader2, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router'
import { toast } from 'sonner'
import Initials from 'components/commons/Initials'
import ExportToasts from 'components/Exports/ExportToasts'
import Sidebar from 'components/commons/Sidebar'
import VersionFooter from 'components/commons/VersionFooter'
import { Button } from 'components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from 'components/ui/sheet'
import { useCurrentUser, useLogout } from 'hooks/reactQuery/useSession'
import { getErrorMessage } from 'utils/errors'
import { NAV_ITEMS } from './constants'
import { initialsOf } from './utils'

const AppLayout = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { data: user } = useCurrentUser()
  const logout = useLogout()
  const [menuOpen, setMenuOpen] = useState(false)
  const section =
    NAV_ITEMS.findLast(({ to }) => pathname.startsWith(to)) ?? NAV_ITEMS[0]

  const handleLogout = (event) => {
    event.preventDefault()
    logout.mutate(undefined, {
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return (
    <div className="min-h-svh">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">
        <Sidebar user={user} />
      </aside>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="left"
          className="w-60 border-0 p-0 text-sidebar-foreground [&>button]:text-white"
        >
          <SheetTitle className="sr-only">{t('nav.label')}</SheetTitle>
          <SheetDescription className="sr-only">
            {t('nav.description')}
          </SheetDescription>
          <Sidebar user={user} onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-svh flex-col lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label={t('nav.open')}
          >
            <Menu />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {t(section.labelKey)}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="ml-auto h-9 gap-2 px-2">
                <Initials className="size-7">{initialsOf(user?.name)}</Initials>
                <span className="hidden text-sm font-medium sm:inline">
                  {user?.name}
                </span>
                <ChevronDown className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="truncate text-sm font-medium">{user?.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleLogout}
                disabled={logout.isPending}
              >
                {logout.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <LogOut />
                )}
                {t('header.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
        <VersionFooter />
        <ExportToasts />
      </div>
    </div>
  )
}

export default AppLayout
