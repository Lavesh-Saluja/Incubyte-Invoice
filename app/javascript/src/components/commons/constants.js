import {
  Building,
  FileDown,
  LayoutDashboard,
  Users,
  Wallet,
} from 'lucide-react'
import { routes } from 'routes'

export const NAV_ITEMS = [
  { to: routes.root, labelKey: 'nav.home', icon: LayoutDashboard, end: true },
  { to: routes.employees.index, labelKey: 'nav.employees', icon: Users },
  { to: routes.departments.index, labelKey: 'nav.departments', icon: Building },
  { to: routes.pay.index, labelKey: 'nav.pay', icon: Wallet },
  { to: routes.exports.index, labelKey: 'nav.exports', icon: FileDown },
]
