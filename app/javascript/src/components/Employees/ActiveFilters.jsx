import { RotateCcw, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/ui/button'
import { FILTER_KEYS } from './constants'

const ActiveFilters = ({ filters, options, onRemove, onClear }) => {
  const { t } = useTranslation()
  const active = FILTER_KEYS.filter((key) => filters[key])

  if (active.length === 0) return null

  const valueLabel = (key) =>
    options[key]?.find(({ value }) => value === filters[key])?.label ??
    filters[key]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t('employees.filters.filteredBy')}
      </span>
      {active.map((key) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-accent py-1 pr-1 pl-3 text-sm text-accent-foreground"
        >
          <span className="text-accent-foreground/80">
            {t(`employees.filters.chips.${key}`)}
          </span>
          <span className="font-medium">{valueLabel(key)}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            className="rounded-full text-accent-foreground hover:bg-primary/15 hover:text-accent-foreground"
            onClick={() => onRemove(key)}
            aria-label={t('employees.filters.remove', {
              filter: t(`employees.filters.chips.${key}`),
            })}
          >
            <X />
          </Button>
        </span>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="text-primary hover:bg-accent hover:text-primary"
        onClick={onClear}
      >
        <RotateCcw />
        {t('employees.filters.clear')}
      </Button>
    </div>
  )
}

export default ActiveFilters
