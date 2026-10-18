import { Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router'
import { cn } from 'cn'
import Initials from 'components/commons/Initials'
import { routes } from 'routes'
import { NAV_ITEMS } from './constants'
import { initialsOf } from './utils'

const Sidebar = ({ user, onNavigate }) => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Link
        to={routes.root}
        onClick={onNavigate}
        className="flex h-16 items-center gap-2.5 px-5 text-base font-semibold text-white"
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary">
          <Building2 className="size-4.5" />
        </span>
        {t('app.name')}
      </Link>

      <nav aria-label={t('nav.label')} className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, labelKey, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive &&
                      'bg-sidebar-accent text-sidebar-accent-foreground',
                  )
                }
              >
                <Icon className="size-4" />
                {t(labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {user && (
        <div className="flex items-center gap-3 border-t border-sidebar-border px-5 py-4">
          <Initials className="bg-sidebar-accent text-white">
            {initialsOf(user.name)}
          </Initials>
          <div className="min-w-0 text-xs">
            <div className="truncate font-medium text-white">{user.name}</div>
            <div className="truncate">{user.email}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
