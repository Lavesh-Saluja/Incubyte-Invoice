import { ArrowLeft, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import DetailList from 'components/commons/DetailList'
import DetailSection from 'components/commons/DetailSection'
import LoadError from 'components/commons/LoadError'
import Spinner from 'components/commons/Spinner'
import { Button } from 'components/ui/button'
import { useShowEmployee } from 'hooks/reactQuery/useEmployees'
import { routes } from 'routes'
import { formatDate } from 'utils/formatDate'
import { buildUrl } from 'utils/url'
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

    return (
      <>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground"
            >
              {initials(employee)}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight">
                {fullName(employee)}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono">{employee.employee_code}</span>
                <StatusBadge status={employee.status} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setNoticeDialog({
                  action: noticeActionFor(employee),
                  employee,
                })
              }
            >
              {t(`employees.notice.${noticeActionFor(employee)}`)}
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
          <div className="flex flex-col gap-6 lg:col-span-2">
            <DetailSection title={t('employees.show.employment')}>
              <DetailList
                items={[
                  {
                    label: t('employees.fields.job_title'),
                    value: employee.job_title,
                  },
                  {
                    label: t('employees.fields.department'),
                    value: employee.department,
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

          <DetailSection title={t('employees.show.record')}>
            <DetailList
              columns={1}
              items={[
                {
                  label: t('employees.table.code'),
                  value: (
                    <span className="font-mono">{employee.employee_code}</span>
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
        </div>
      </>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to={routes.employees.index}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t('employees.show.back')}
      </Link>
      {renderContent()}
      <NoticeDialog
        dialog={noticeDialog}
        onClose={() => setNoticeDialog(null)}
      />
    </main>
  )
}

export default Show
