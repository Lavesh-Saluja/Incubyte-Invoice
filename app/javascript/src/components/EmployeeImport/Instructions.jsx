import { useTranslation } from 'react-i18next'
import { Badge } from 'components/ui/badge'
import { Card } from 'components/ui/card'
import { formatNumber } from 'utils/formatNumber'
import { CONDITIONAL_COLUMNS, IMPORT_COLUMNS } from './constants'

const Instructions = ({ settings }) => {
  const { t } = useTranslation()

  return (
    <Card className="gap-0 py-0">
      <div className="border-b p-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold">
            {t('employeeImport.prepare.title')}
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-muted-foreground">
            <li>
              {t('employeeImport.prepare.limits', {
                rows: formatNumber(settings?.import_max_rows),
                size: settings?.import_max_file_mb,
              })}
            </li>
            <li>{t('employeeImport.prepare.allOrNothing')}</li>
            <li>{t('employeeImport.prepare.createOnly')}</li>
            <li>{t('employeeImport.prepare.effectiveFrom')}</li>
          </ul>
        </div>
      </div>
      <div className="hidden grid-cols-[15rem_9rem_1fr] gap-3 border-b bg-muted/40 px-5 py-2.5 text-xs font-medium text-muted-foreground md:grid">
        <span>{t('employeeImport.columns.column')}</span>
        <span>{t('employeeImport.columns.required')}</span>
        <span>{t('employeeImport.columns.rules')}</span>
      </div>
      <ul className="divide-y">
        {IMPORT_COLUMNS.map((column) => (
          <li
            key={column}
            className="grid gap-1.5 px-5 py-2.5 text-sm md:grid-cols-[15rem_9rem_1fr] md:gap-3"
          >
            <span className="flex flex-wrap items-center justify-between gap-2 md:contents">
              <span className="font-mono text-[13px] break-all">{column}</span>
              <span>
                {CONDITIONAL_COLUMNS.includes(column) ? (
                  <Badge variant="outline">
                    {t('employeeImport.columns.conditional')}
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    {t('employeeImport.columns.yes')}
                  </Badge>
                )}
              </span>
            </span>
            <span className="text-[13px] text-muted-foreground">
              {t(`employeeImport.columns.rule.${column}`)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default Instructions
