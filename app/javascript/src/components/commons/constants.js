import { LayoutDashboard, Users } from 'lucide-react'
import { routes } from 'routes'

export const NAV_ITEMS = [
  { to: routes.root, labelKey: 'nav.home', icon: LayoutDashboard, end: true },
  { to: routes.employees.index, labelKey: 'nav.employees', icon: Users },
]
