import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Button } from 'components/ui/button'
import { Card } from 'components/ui/card'
import { routes } from 'routes'
import { formatNumber } from 'utils/formatNumber'

const ImportComplete = ({ outcome, onImportAnother }) => {
  const { t } = useTranslation()

  return (
    <Card className="items-center gap-3 px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-success-surface">
        <CheckCircle2 aria-hidden="true" className="size-6 text-success" />
      </span>
      <h2 className="text-lg font-semibold">
        {t('employeeImport.done.title', {
          count: formatNumber(outcome.employees_created),
        })}
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {t('employeeImport.done.description', {
          employees: formatNumber(outcome.employees_created),
          salaries: formatNumber(outcome.salaries_created),
        })}
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Button variant="outline" onClick={onImportAnother}>
          {t('employeeImport.actions.importAnother')}
        </Button>
        <Button asChild>
          <Link to={routes.employees.index}>
            {t('employeeImport.actions.viewEmployees')}
          </Link>
        </Button>
      </div>
    </Card>
  )
}

export default ImportComplete
