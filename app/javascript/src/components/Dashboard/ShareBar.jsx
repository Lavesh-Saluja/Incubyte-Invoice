import { useTranslation } from 'react-i18next'

const percentOf = (part, whole) => (whole === 0 ? 0 : (part / whole) * 100)

const ShareBar = ({ active, noticePeriod, headcount }) => {
  const { t } = useTranslation()
  const share = Math.round(percentOf(active + noticePeriod, headcount))

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-2 flex-1 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={t('dashboard.departments.shareLabel', { percent: share })}
      >
        <div
          className="bg-success"
          style={{ width: `${percentOf(active, headcount)}%` }}
        />
        <div
          className="bg-warning"
          style={{ width: `${percentOf(noticePeriod, headcount)}%` }}
        />
      </div>
      <span className="w-10 text-right text-sm text-muted-foreground tabular-nums">
        {t('dashboard.percent', { value: share })}
      </span>
    </div>
  )
}

export default ShareBar
