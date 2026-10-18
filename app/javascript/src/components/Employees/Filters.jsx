import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from 'components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select'
import { ALL_OPTION } from './constants'

const FilterSelect = ({ label, allLabel, value, options, onChange }) => (
  <Select
    value={value || ALL_OPTION}
    onValueChange={(next) => onChange(next === ALL_OPTION ? '' : next)}
  >
    <SelectTrigger aria-label={label} className="w-full bg-card sm:w-44">
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

const Filters = ({ filters, options, onChange }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={filters.q}
          onChange={(event) => onChange('q', event.target.value)}
          placeholder={t('employees.filters.searchPlaceholder')}
          aria-label={t('employees.filters.search')}
          className="bg-card pl-9"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:flex">
        <FilterSelect
          label={t('employees.table.status')}
          allLabel={t('employees.filters.allStatuses')}
          value={filters.status}
          options={options.status}
          onChange={(value) => onChange('status', value)}
        />
        <FilterSelect
          label={t('employees.fields.department')}
          allLabel={t('employees.filters.allDepartments')}
          value={filters.department_id}
          options={options.department_id}
          onChange={(value) => onChange('department_id', value)}
        />
        <FilterSelect
          label={t('employees.fields.country')}
          allLabel={t('employees.filters.allCountries')}
          value={filters.country}
          options={options.country}
          onChange={(value) => onChange('country', value)}
        />
      </div>
    </div>
  )
}

export default Filters
