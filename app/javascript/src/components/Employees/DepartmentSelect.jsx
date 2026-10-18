import { Check, ChevronsUpDown, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import { useCreateDepartment } from 'hooks/reactQuery/useDepartments'
import { getErrorMessage } from 'utils/errors'

const DepartmentSelect = ({
  id,
  value,
  departments,
  onChange,
  onClose,
  ...ariaProps
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { mutate: createDepartment, isPending: isCreating } =
    useCreateDepartment()
  const selected = departments?.find((department) => department.id === value)
  const newName = search.trim().replace(/\s+/g, ' ')
  const exists = departments?.some(
    ({ name }) => name.toLowerCase() === newName.toLowerCase(),
  )

  const close = () => {
    setOpen(false)
    setSearch('')
    onClose?.()
  }

  const handleCreate = () =>
    createDepartment(
      { name: newName },
      {
        onSuccess: (department) => {
          onChange(department.id)
          toast.success(
            t('departments.notices.created', { name: department.name }),
          )
          close()
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )

  return (
    <Popover
      open={open}
      onOpenChange={(next) => (next ? setOpen(true) : close())}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={!departments}
          aria-busy={!departments}
          className="w-full justify-between font-normal"
          {...ariaProps}
        >
          <span
            className={cn('truncate', !selected && 'text-muted-foreground')}
          >
            {selected?.name ??
              (departments && t('employees.form.departmentPlaceholder'))}
          </span>
          {departments ? (
            <ChevronsUpDown className="opacity-50" />
          ) : (
            <Loader2 aria-hidden="true" className="animate-spin" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={t('employees.form.departmentSearch')}
          />
          <CommandList>
            <CommandEmpty>{t('employees.form.departmentEmpty')}</CommandEmpty>
            <CommandGroup>
              {departments?.map((department) => (
                <CommandItem
                  key={department.id}
                  value={department.name}
                  onSelect={() => {
                    onChange(department.id)
                    close()
                  }}
                >
                  <Check
                    className={cn(
                      value === department.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="truncate">{department.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {newName && !exists && (
              <CommandGroup forceMount>
                <CommandItem
                  forceMount
                  value={`create:${newName}`}
                  onSelect={handleCreate}
                  disabled={isCreating}
                  className="text-primary"
                >
                  {isCreating ? <Loader2 className="animate-spin" /> : <Plus />}
                  {t('employees.form.departmentCreate', { name: newName })}
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default DepartmentSelect
