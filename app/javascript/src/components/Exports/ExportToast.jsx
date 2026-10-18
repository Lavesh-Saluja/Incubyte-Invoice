import { AlertCircle, CheckCircle2, Download, Loader2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from 'cn'
import { Button } from 'components/ui/button'
import { formatNumber } from 'utils/formatNumber'
import { DOWNLOAD_PHASES } from './constants'

const ICONS = {
  completed: { icon: CheckCircle2, className: 'text-success' },
  failed: { icon: AlertCircle, className: 'text-destructive' },
}

const ProgressBar = ({ progress, indeterminate }) => (
  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
    <div
      className={cn(
        'h-full rounded-full bg-primary transition-[width] duration-700 ease-out',
        indeterminate && 'w-1/3 animate-pulse',
      )}
      style={indeterminate ? undefined : { width: `${progress}%` }}
    />
  </div>
)

const ExportToast = ({ item, download, onDownload, onDismiss, onRetry }) => {
  const { t } = useTranslation()
  const { status, progress, processed_rows: done, total_rows: total } = item
  const preparing = status === 'queued' || total === null
  const downloading = download === DOWNLOAD_PHASES.pending
  const downloaded = download === DOWNLOAD_PHASES.done
  const { icon: Icon, className } = (!downloading && ICONS[status]) || {
    icon: Loader2,
    className: 'animate-spin text-primary',
  }

  const title = () => {
    if (status === 'completed') {
      if (downloading) return t('exports.toast.downloading')
      return downloaded
        ? t('exports.toast.downloaded')
        : t('exports.toast.ready')
    }
    if (status === 'failed') return t('exports.toast.failed')
    return preparing
      ? t('exports.toast.preparing')
      : t('exports.toast.exporting')
  }

  const detail = () => {
    if (status === 'completed')
      return t('exports.toast.readyDetail', { count: formatNumber(total) })
    if (status === 'failed') return item.error_message
    if (preparing) return t('exports.toast.preparingDetail')
    return t('exports.toast.progress', {
      done: formatNumber(done),
      total: formatNumber(total),
    })
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-[22rem] max-w-[calc(100vw-2rem)] rounded-lg border bg-card p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <Icon
          aria-hidden="true"
          className={cn('mt-0.5 size-4 shrink-0', className)}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-medium">{title()}</p>
            {status === 'processing' && !preparing && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {t('dashboard.percent', { value: progress })}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[13px] text-muted-foreground tabular-nums">
            {detail()}
          </p>
          {['queued', 'processing'].includes(status) && (
            <ProgressBar
              key={preparing ? 'preparing' : 'progress'}
              progress={progress}
              indeterminate={preparing}
            />
          )}
          {status === 'completed' &&
            !downloading &&
            (downloaded ? (
              <Button
                variant="link"
                size="sm"
                className="mt-1 h-auto px-0"
                onClick={onDownload}
              >
                {t('exports.actions.downloadAgain')}
              </Button>
            ) : (
              <Button size="sm" className="mt-3" onClick={onDownload}>
                <Download />
                {t('exports.actions.download')}
              </Button>
            ))}
          {status === 'failed' && (
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={onRetry}
            >
              {t('exports.actions.retry')}
            </Button>
          )}
        </div>
        {!['queued', 'processing'].includes(status) && !downloading && (
          <Button
            variant="ghost"
            size="icon-xs"
            className="-mt-1 -mr-1 text-muted-foreground"
            onClick={onDismiss}
            aria-label={t('exports.actions.dismiss')}
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  )
}

export default ExportToast
