import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { cn } from 'cn'
import DetailList from 'components/commons/DetailList'
import DetailSection from 'components/commons/DetailSection'
import Breadcrumbs from 'components/commons/Breadcrumbs'
import Initials from 'components/commons/Initials'
import LoadError from 'components/commons/LoadError'
import Spinner from 'components/commons/Spinner'
import { Button } from 'components/ui/button'
import { useShowEmployee } from 'hooks/reactQuery/useEmployees'
import { routes } from 'routes'
import { formatDate } from 'utils/formatDate'
import { buildUrl } from 'utils/url'
import { NOTICE_ACTIONS } from './constants'
import NoticeDialog from './NoticeDialog'
import SalarySection from './SalarySection'
import StatusBadge from './StatusBadge'
import { fullName, initials, isEditable, noticeActionFor } from './utils'

const Show = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const [noticeDialog, setNoticeDialog] = useState(null)
  const {
    data: employee,
    isPending,
    isError,
    error,
    refetch,
  } = useShowEmployee(id)

  const renderContent = () => {
    if (isPending)
      return <Spinner label={t('employees.loading')} className="min-h-[60vh]" />
    if (isError) return <LoadError error={error} onRetry={() => refetch()} />

    const hasNoticePeriod = Boolean(employee.notice_period_started_at)
    const noticeAction = noticeActionFor(employee)

    return (
      <>
        <Breadcrumbs
          items={[
            { label: t('nav.employees'), to: routes.employees.index },
            { label: fullName(employee) },
          ]}
        />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Initials className="size-14 text-lg">
              {initials(employee)}
            </Initials>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate text-[28px] leading-9 font-semibold">
                  {fullName(employee)}
                </h1>
                <StatusBadge status={employee.status} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground tabular-nums">
                {employee.employee_code}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={cn(
                noticeAction === NOTICE_ACTIONS.START &&
                  'border-destructive/30 text-destructive hover:bg-destructive-surface hover:text-destructive',
              )}
              onClick={() =>
                setNoticeDialog({ action: noticeAction, employee })
              }
            >
              {t(`employees.notice.${noticeAction}`)}
            </Button>
            {isEditable(employee) && (
              <Button variant="outline" asChild>
                <Link to={buildUrl(routes.employees.edit, { id: employee.id })}>
                  <Pencil />
                  {t('employees.actions.edit')}
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
            <DetailSection title={t('employees.show.employment')}>
              <DetailList
                items={[
                  {
                    label: t('employees.fields.job_title'),
                    value: employee.job_title,
                  },
                  {
                    label: t('employees.fields.department'),
                    value: employee.department.name,
                  },
                  {
                    label: t('employees.fields.country'),
                    value: employee.country_name,
                  },
                  {
                    label: t('employees.fields.email'),
                    value: employee.email,
                  },
                ]}
              />
            </DetailSection>

            <SalarySection employee={employee} />
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <DetailSection title={t('employees.show.record')}>
              <DetailList
                items={[
                  {
                    label: t('employees.table.code'),
                    value: (
                      <span className="tabular-nums">
                        {employee.employee_code}
                      </span>
                    ),
                  },
                  {
                    label: t('employees.table.status'),
                    value: <StatusBadge status={employee.status} />,
                  },
                  {
                    label: t('employees.show.joined'),
                    value: formatDate(employee.created_at),
                  },
                  {
                    label: t('employees.show.updated'),
                    value: formatDate(employee.updated_at),
                  },
                ]}
              />
            </DetailSection>
            {hasNoticePeriod && (
              <DetailSection title={t('employees.show.noticePeriod')}>
                <DetailList
                  items={[
                    {
                      label: t('employees.show.noticeStarted'),
                      value: formatDate(employee.notice_period_started_at),
                    },
                    {
                      label: t(
                        employee.status === 'inactive'
                          ? 'employees.show.noticeEnded'
                          : 'employees.show.noticeEnds',
                      ),
                      value: formatDate(employee.notice_period_ends_at),
                    },
                  ]}
                />
              </DetailSection>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      {renderContent()}
      <NoticeDialog
        dialog={noticeDialog}
        onClose={() => setNoticeDialog(null)}
      />
    </div>
  )
}

export default Show
