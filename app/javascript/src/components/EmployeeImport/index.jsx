import { FileText } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import Callout from 'components/commons/Callout'
import PageHeader from 'components/commons/PageHeader'
import Spinner from 'components/commons/Spinner'
import { Button } from 'components/ui/button'
import { Card } from 'components/ui/card'
import {
  useCreateEmployeeImport,
  usePreviewEmployeeImport,
} from 'hooks/reactQuery/useEmployeeImports'
import { useSettings } from 'hooks/reactQuery/useSettings'
import { routes } from 'routes'
import { getErrorMessage } from 'utils/errors'
import { formatNumber } from 'utils/formatNumber'
import ConfirmDialog from './ConfirmDialog'
import ErrorsTable from './ErrorsTable'
import FilePicker from './FilePicker'
import ImportComplete from './ImportComplete'
import Instructions from './Instructions'
import PreviewTable from './PreviewTable'
import Summary from './Summary'
import TemplateButton from './TemplateButton'
import { fileProblem, formatFileSize, importFailure, isTooLarge } from './utils'

const Section = ({ title, children }) => (
  <section className="border-b last:border-b-0">
    <h3 className="px-5 pt-4 pb-2 text-sm font-semibold">{title}</h3>
    {children}
  </section>
)

const EmployeeImport = () => {
  const { t } = useTranslation()
  const { data: settings } = useSettings()
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [outcome, setOutcome] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const { mutate: preview, isPending: checking } = usePreviewEmployeeImport()
  const { mutate: create, isPending: importing } = useCreateEmployeeImport()

  const check = (selected) => {
    setFile(selected)
    setResult(null)
    if (isTooLarge(selected, settings?.import_max_file_mb)) {
      setResult(
        fileProblem(
          t('employeeImport.upload.tooLarge', {
            size: settings.import_max_file_mb,
          }),
        ),
      )
      return
    }

    preview(selected, {
      onSuccess: setResult,
      onError: (error) => {
        setFile(null)
        toast.error(getErrorMessage(error))
      },
    })
  }

  const runImport = () =>
    create(file, {
      onSuccess: (created) => {
        setConfirming(false)
        setFile(null)
        setResult(null)
        setOutcome(created)
        toast.success(
          t('employeeImport.done.toast', {
            count: formatNumber(created.employees_created),
          }),
        )
      },
      onError: (error) => {
        setConfirming(false)
        const failed = importFailure(error)
        if (failed) setResult(failed)
        toast.error(getErrorMessage(error))
      },
    })

  const startOver = () => {
    setOutcome(null)
    setFile(null)
    setResult(null)
  }

  const renderResult = () => {
    if (checking)
      return (
        <div className="pb-10">
          <Spinner
            label={t('employeeImport.upload.checking')}
            className="pb-3"
          />
          <p className="text-center text-sm text-muted-foreground">
            {t('employeeImport.upload.checking')}
          </p>
        </div>
      )
    if (!result) return null

    return (
      <>
        <Summary result={result} />
        {result.errors.length > 0 && (
          <Section
            title={t('employeeImport.errors.title', {
              count: formatNumber(result.errors_count),
            })}
          >
            <ErrorsTable errors={result.errors} total={result.errors_count} />
          </Section>
        )}
        {result.preview.length > 0 && (
          <Section title={t('employeeImport.preview.title')}>
            <PreviewTable rows={result.preview} total={result.total_rows} />
          </Section>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/30 px-5 py-4">
          <p className="text-[13px] text-muted-foreground">
            {result.valid
              ? t('employeeImport.ready', {
                  count: formatNumber(result.valid_rows),
                })
              : t('employeeImport.notReady')}
          </p>
          <Button
            onClick={() => setConfirming(true)}
            disabled={!result.valid || importing}
          >
            {result.valid
              ? t('employeeImport.actions.import', {
                  count: formatNumber(result.valid_rows),
                })
              : t('employeeImport.actions.importBlocked')}
          </Button>
        </div>
      </>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={t('employeeImport.title')}
        description={t('employeeImport.description')}
        breadcrumbs={[
          { label: t('nav.employees'), to: routes.employees.index },
          { label: t('employeeImport.title') },
        ]}
        actions={<TemplateButton />}
      />
      {outcome ? (
        <ImportComplete outcome={outcome} onImportAnother={startOver} />
      ) : (
        <div className="flex flex-col gap-6">
          <Card className="gap-0 overflow-hidden py-0">
            <div className="border-b p-5">
              <h2 className="text-base font-semibold">
                {t('employeeImport.upload.title')}
              </h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {t('employeeImport.upload.description')}
              </p>
            </div>
            <div className="p-5">
              {file ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText
                      aria-hidden="true"
                      className="size-5 shrink-0 text-muted-foreground"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <FilePicker
                    compact
                    onSelect={check}
                    disabled={checking || importing}
                  />
                </div>
              ) : (
                <FilePicker onSelect={check} />
              )}
              {result && !result.valid && result.total_rows === 0 && (
                <div className="mt-4">
                  <Callout tone="error">
                    {t('employeeImport.fileRejected')}
                  </Callout>
                </div>
              )}
            </div>
            {renderResult()}
          </Card>
          <Instructions settings={settings} />
        </div>
      )}
      <ConfirmDialog
        open={confirming}
        count={result?.valid_rows ?? 0}
        importing={importing}
        onConfirm={runImport}
        onClose={() => !importing && setConfirming(false)}
      />
    </div>
  )
}

export default EmployeeImport
