import { useTranslation } from 'react-i18next'
import { formatNumber } from 'utils/formatNumber'

const ErrorsTable = ({ errors, total }) => {
  const { t } = useTranslation()

  return (
    <div>
      <div className="hidden grid-cols-[5rem_14rem_1fr] gap-3 border-b px-5 py-2.5 text-xs font-medium text-muted-foreground md:grid">
        <span>{t('employeeImport.errors.row')}</span>
        <span>{t('employeeImport.errors.column')}</span>
        <span>{t('employeeImport.errors.problem')}</span>
      </div>
      <ul className="max-h-96 divide-y overflow-y-auto">
        {errors.map((error, index) => (
          <li
            key={`${error.row}-${error.column}-${index}`}
            className="grid gap-0.5 px-5 py-2.5 text-sm md:grid-cols-[5rem_14rem_1fr] md:gap-3"
          >
            <span className="flex flex-wrap gap-x-2 text-xs text-muted-foreground md:contents md:text-sm md:text-foreground">
              <span className="tabular-nums">
                <span className="md:hidden">
                  {t('employeeImport.errors.row')}{' '}
                </span>
                {error.row ?? t('employeeImport.errors.file')}
              </span>
              <span className="font-mono text-[13px] break-all">
                {error.column ?? t('employeeImport.errors.wholeRow')}
              </span>
            </span>
            <span className="text-destructive">{error.message}</span>
          </li>
        ))}
      </ul>
      {total > errors.length && (
        <p className="border-t px-5 py-2.5 text-[13px] text-muted-foreground">
          {t('employeeImport.errors.truncated', {
            shown: formatNumber(errors.length),
            total: formatNumber(total),
          })}
        </p>
      )}
    </div>
  )
}

export default ErrorsTable
