import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from 'cn'
import { Button } from 'components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover'

const CountrySelect = ({ id, value, countries, onChange, ...ariaProps }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const selected = countries?.find((country) => country.code === value)

  const placeholder = countries
    ? t('employees.form.countryPlaceholder')
    : t('employees.form.countriesLoading')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={!countries}
          className="w-full justify-between font-normal"
          {...ariaProps}
        >
          <span
            className={cn('truncate', !selected && 'text-muted-foreground')}
          >
            {selected?.name ?? placeholder}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder={t('employees.form.countrySearch')} />
          <CommandList>
            <CommandEmpty>{t('employees.form.countryEmpty')}</CommandEmpty>
            <CommandGroup>
              {countries?.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.code}`}
                  onSelect={() => {
                    onChange(country.code)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      value === country.code ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="truncate">{country.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {country.currency}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CountrySelect
