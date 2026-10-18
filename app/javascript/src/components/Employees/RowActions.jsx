import { MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Button } from 'components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu'
import { routes } from 'routes'
import { buildUrl } from 'utils/url'
import { fullName, isEditable, noticeActionFor } from './utils'

const RowActions = ({ employee, onNoticeAction }) => {
  const { t } = useTranslation()
  const noticeAction = noticeActionFor(employee)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t('employees.actions.menu', { name: fullName(employee) })}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isEditable(employee) && (
          <DropdownMenuItem asChild>
            <Link to={buildUrl(routes.employees.edit, { id: employee.id })}>
              {t('employees.actions.edit')}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={() => onNoticeAction({ action: noticeAction, employee })}
        >
          {t(`employees.notice.${noticeAction}`)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default RowActions
