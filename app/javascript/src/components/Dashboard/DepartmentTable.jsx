import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import DetailSection from 'components/commons/DetailSection'
import { DASHBOARD_COLUMNS } from 'components/Departments/constants'
import StatsTable from 'components/Departments/StatsTable'
import { routes } from 'routes'

const DepartmentTable = ({ departments, headcount }) => {
  const { t } = useTranslation()

  return (
    <DetailSection
      title={t('dashboard.departments.title')}
      actions={
        <Link
          to={routes.departments.index}
          className="text-[13px] font-medium text-primary hover:underline"
        >
          {t('dashboard.departments.viewAll')}
        </Link>
      }
    >
      {departments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('dashboard.departments.empty')}
        </p>
      ) : (
        <div className="-mx-5 -mb-5 border-t">
          <StatsTable
            rows={departments}
            columns={DASHBOARD_COLUMNS}
            headcount={headcount}
          />
        </div>
      )}
    </DetailSection>
  )
}

export default DepartmentTable
