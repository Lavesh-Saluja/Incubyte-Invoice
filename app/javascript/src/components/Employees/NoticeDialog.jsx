import { useSettings } from 'hooks/reactQuery/useSettings'
import { NOTICE_ACTIONS } from './constants'
import RemoveNoticeDialog from './RemoveNoticeDialog'
import StartNoticeDialog from './StartNoticeDialog'

const NoticeDialog = ({ dialog, onClose }) => {
  const { data: settings } = useSettings()

  if (!dialog) return null
  if (dialog.action === NOTICE_ACTIONS.REMOVE)
    return <RemoveNoticeDialog employee={dialog.employee} onClose={onClose} />
  if (!settings) return null

  return (
    <StartNoticeDialog
      employee={dialog.employee}
      settings={settings}
      onClose={onClose}
    />
  )
}

export default NoticeDialog
