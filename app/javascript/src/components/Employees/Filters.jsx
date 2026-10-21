import { Search, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from 'components/ui/badge'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select'
import { ALL_OPTION, MORE_FILTER_KEYS } from './constants'

const FilterSelect = ({ label, allLabel, value, options, onChange }) => (
  <Select
    value={value || ALL_OPTION}
    onValueChange={(next) => onChange(next === ALL_OPTION ? '' : next)}
  >
    <SelectTrigger aria-label={label} className="w-full bg-card">
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

const MoreFiltersField = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <Label>{label}</Label>
    {children}
  </div>
)

const Filters = ({ filters, options, onChange }) => {
  const { t } = useTranslation()
  const moreFiltersCount = MORE_FILTER_KEYS.filter((key) => filters[key]).length

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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-between bg-card sm:w-44"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                {t('employees.filters.moreFilters')}
              </span>
              {moreFiltersCount > 0 && (
                <Badge variant="secondary">{moreFiltersCount}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="flex flex-col gap-4">
            <MoreFiltersField label={t('employees.fields.department')}>
              <FilterSelect
                label={t('employees.fields.department')}
                allLabel={t('employees.filters.allDepartments')}
                value={filters.department_id}
                options={options.department_id}
                onChange={(value) => onChange('department_id', value)}
              />
            </MoreFiltersField>
            <MoreFiltersField label={t('employees.fields.country')}>
              <FilterSelect
                label={t('employees.fields.country')}
                allLabel={t('employees.filters.allCountries')}
                value={filters.country}
                options={options.country}
                onChange={(value) => onChange('country', value)}
              />
            </MoreFiltersField>
            <MoreFiltersField label={t('employees.filters.noticeEnds')}>
              <FilterSelect
                label={t('employees.filters.noticeEnds')}
                allLabel={t('employees.filters.anyNoticeEnd')}
                value={filters.leaving_within}
                options={options.leaving_within}
                onChange={(value) => onChange('leaving_within', value)}
              />
            </MoreFiltersField>
            <MoreFiltersField label={t('employees.filters.minSalary')}>
              <Input
                type="number"
                min="0"
                value={filters.min_salary}
                onChange={(event) => onChange('min_salary', event.target.value)}
                placeholder={t('employees.filters.minSalaryPlaceholder')}
                aria-label={t('employees.filters.minSalary')}
                className="bg-card"
              />
            </MoreFiltersField>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default Filters
