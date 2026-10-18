import { useTranslation } from 'react-i18next'

const ShareBar = ({ value, headcount }) => {
  const { t } = useTranslation()
  const share = headcount === 0 ? 0 : Math.round((value / headcount) * 100)

  return (
    <div className="flex items-center gap-3">
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={t('dashboard.departments.shareLabel', { percent: share })}
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${share}%` }}
        />
      </div>
      <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">
        {t('dashboard.percent', { value: share })}
      </span>
    </div>
  )
}

export default ShareBar
