import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import DetailList from 'components/commons/DetailList'
import DetailSection from 'components/commons/DetailSection'
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
        <p className="text-sm text-muted-foreground">
          {t('employees.salary.none')}
        </p>
        {isEditable(employee) && (
          <Link
            to={buildUrl(routes.employees.edit, { id: employee.id })}
            className="mt-3 inline-block text-sm text-primary underline"
          >
            {t('employees.salary.add')}
          </Link>
        )}
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
        items={AMOUNT_FIELDS.map((name) => ({
          label: t(`employees.salary.${name}`),
          value: formatCurrency(salary[name], salary.currency),
        }))}
      />
    </DetailSection>
  )
}

export default SalarySection
