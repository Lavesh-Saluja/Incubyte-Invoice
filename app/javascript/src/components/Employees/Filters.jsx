import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select'
import { useCountries, useDepartments } from 'hooks/reactQuery/useSelectOptions'
import { ALL_OPTION, EMPLOYEE_STATUSES } from './constants'

const FilterSelect = ({ label, allLabel, value, options, onChange }) => (
  <Select
    value={value || ALL_OPTION}
    onValueChange={(next) => onChange(next === ALL_OPTION ? '' : next)}
  >
    <SelectTrigger aria-label={label} className="w-full sm:w-44">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={ALL_OPTION}>{allLabel}</SelectItem>
      {options.map(({ value: optionValue, label: optionLabel }) => (
        <SelectItem key={optionValue} value={optionValue}>
          {optionLabel}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

const Filters = ({ filters, onChange, onClear }) => {
  const { t } = useTranslation()
  const { data: departments = [] } = useDepartments()
  const { data: countries = [] } = useCountries({ inUse: true })
  const hasFilters = Object.values(filters).some(Boolean)

  const statusOptions = EMPLOYEE_STATUSES.map((status) => ({
    value: status,
    label: t(`employees.status.${status}`),
  }))
  const departmentOptions = departments.map((department) => ({
    value: department,
    label: department,
  }))
  const countryOptions = countries.map(({ code, name }) => ({
    value: code,
    label: name,
  }))

  return (
    <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={filters.q}
          onChange={(event) => onChange('q', event.target.value)}
          placeholder={t('employees.filters.searchPlaceholder')}
          aria-label={t('employees.filters.search')}
          className="pl-9"
        />
      </div>
      <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
        <FilterSelect
          label={t('employees.table.status')}
          allLabel={t('employees.filters.allStatuses')}
          value={filters.status}
          options={statusOptions}
          onChange={(value) => onChange('status', value)}
        />
        <FilterSelect
          label={t('employees.fields.department')}
          allLabel={t('employees.filters.allDepartments')}
          value={filters.department}
          options={departmentOptions}
          onChange={(value) => onChange('department', value)}
        />
        <FilterSelect
          label={t('employees.fields.country')}
          allLabel={t('employees.filters.allCountries')}
          value={filters.country}
          options={countryOptions}
          onChange={(value) => onChange('country', value)}
        />
        {hasFilters && (
          <Button variant="ghost" onClick={onClear}>
            <X />
            {t('employees.filters.clear')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Filters
