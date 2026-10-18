import { Clock, UserCheck, Users, UserX } from 'lucide-react'

export const STAT_CARDS = [
  {
    key: 'current_headcount',
    icon: Users,
    iconClassName: 'bg-accent text-primary',
    filters: {},
  },
  {
    key: 'active',
    icon: UserCheck,
    iconClassName: 'bg-success-surface text-success',
    filters: { status: 'active' },
  },
  {
    key: 'notice_period',
    icon: Clock,
    iconClassName: 'bg-warning-surface text-warning',
    filters: { status: 'notice_period' },
  },
  {
    key: 'inactive',
    icon: UserX,
    iconClassName: 'bg-destructive-surface text-destructive',
    filters: { status: 'inactive' },
  },
]
