import { Download, FileDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { toast } from 'sonner'
import EmptyState from 'components/commons/EmptyState'
import LoadError from 'components/commons/LoadError'
import PageHeader from 'components/commons/PageHeader'
import Spinner from 'components/commons/Spinner'
import { Button } from 'components/ui/button'
import { Card } from 'components/ui/card'
import { useCreateExport, useFetchExports } from 'hooks/reactQuery/useExports'
import { routes } from 'routes'
import { getErrorMessage } from 'utils/errors'
import { downloadExport, markStartedHere } from 'utils/exports'
import { formatDateTime } from 'utils/formatDate'
import { formatNumber } from 'utils/formatNumber'
import StatusPill from './StatusPill'
import { exportTitle } from './utils'

const HEAD_CLASS = 'px-4 py-2.5 text-left text-xs font-medium whitespace-nowrap'

const Exports = () => {
  const { t } = useTranslation()
  const { data: items, isPending, isError, error, refetch } = useFetchExports()
  const { mutate: createExport, isPending: isRetrying } = useCreateExport()

  const retry = (item) =>
    createExport(item.filter_values, {
      onSuccess: (created) => markStartedHere(created.id),
      onError: (apiError) => toast.error(getErrorMessage(apiError)),
    })

  const renderAction = (item) => {
    if (item.downloadable)
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadExport(item.id)}
        >
          <Download />
          {t('exports.actions.download')}
        </Button>
      )
    if (item.status === 'failed')
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => retry(item)}
          disabled={isRetrying}
        >
          {t('exports.actions.retry')}
        </Button>
      )
    return null
  }

  const renderContent = () => {
    if (isPending) return <Spinner label={t('exports.loading')} />
    if (isError) return <LoadError error={error} onRetry={() => refetch()} />
    if (items.length === 0)
      return (
        <EmptyState
          icon={FileDown}
          title={t('exports.emptyTitle')}
          description={t('exports.emptyDescription')}
          action={
            <Button variant="outline" asChild>
              <Link to={routes.employees.index}>
                {t('exports.goToEmployees')}
              </Link>
            </Button>
          }
        />
      )

    return (
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-muted-foreground">
              <th className={`${HEAD_CLASS} pl-5`}>
                {t('exports.table.export')}
              </th>
              <th className={HEAD_CLASS}>{t('exports.table.requested')}</th>
              <th className={`${HEAD_CLASS} text-right`}>
                {t('exports.table.rows')}
              </th>
              <th className={HEAD_CLASS}>{t('exports.table.status')}</th>
              <th className={`${HEAD_CLASS} w-0 pr-5`}>
                <span className="sr-only">{t('exports.table.actions')}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 pr-4 pl-5">
                  <div className="font-medium">{exportTitle(item)}</div>
                  {item.status === 'failed' && (
                    <div className="text-xs text-destructive">
                      {item.error_message}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground tabular-nums">
                  {formatDateTime(item.created_at)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {item.total_rows === null
                    ? t('common.none')
                    : formatNumber(item.total_rows)}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={item.status} progress={item.progress} />
                </td>
                <td className="py-3 pr-5 pl-4 text-right">
                  {renderAction(item)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={t('exports.title')}
        description={t('exports.description')}
      />
      <Card className="gap-0 overflow-hidden py-0">{renderContent()}</Card>
    </div>
  )
}

export default Exports
