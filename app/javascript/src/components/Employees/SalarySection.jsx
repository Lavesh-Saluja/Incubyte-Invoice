import { Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import DetailList from 'components/commons/DetailList'
import DetailSection from 'components/commons/DetailSection'
import EmptyState from 'components/commons/EmptyState'
import { Button } from 'components/ui/button'
import { routes } from 'routes'
import { formatCurrency } from 'utils/formatCurrency'
import { formatDate } from 'utils/formatDate'
import { buildUrl } from 'utils/url'
import { AMOUNT_FIELDS } from './constants'
import { isEditable } from './utils'

const SalarySection = ({ employee }) => {
  const { t } = useTranslation()
  const { salary } = employee

  if (!salary)
    return (
      <DetailSection title={t('employees.salary.title')}>
        <EmptyState
          icon={Wallet}
          title={t('employees.salary.none')}
          compact
          action={
            isEditable(employee) && (
              <Button variant="outline" size="sm" asChild>
                <Link to={buildUrl(routes.employees.edit, { id: employee.id })}>
                  {t('employees.salary.add')}
                </Link>
              </Button>
            )
          }
        />
      </DetailSection>
    )

  return (
    <DetailSection
      title={t('employees.salary.title')}
      description={t('employees.salary.description', {
        currency: salary.currency,
        date: formatDate(salary.effective_from),
      })}
    >
      <DetailList
        variant="amounts"
        items={AMOUNT_FIELDS.map((name) => ({
          label: t(`employees.salary.${name}`),
          value: formatCurrency(salary[name], salary.currency),
        }))}
      />
    </DetailSection>
  )
}

export default SalarySection
