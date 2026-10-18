import { FileUp } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from 'cn'
import { buttonVariants } from 'components/ui/button'
import { IMPORT_FILE_ACCEPT } from 'constants/employeeImports'

const FilePicker = ({ onSelect, disabled, compact }) => {
  const { t } = useTranslation()
  const inputId = useId()
  const [dragging, setDragging] = useState(false)

  const select = (file) => {
    if (file && !disabled) onSelect(file)
  }

  const dropHandlers = {
    onDragOver: (event) => {
      event.preventDefault()
      setDragging(true)
    },
    onDragLeave: () => setDragging(false),
    onDrop: (event) => {
      event.preventDefault()
      setDragging(false)
      select(event.dataTransfer.files[0])
    },
  }

  return (
    <label
      htmlFor={inputId}
      {...dropHandlers}
      className={cn(
        compact
          ? buttonVariants({ variant: 'outline', size: 'sm' })
          : 'flex flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center transition-colors hover:bg-muted/40',
        'relative cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
        dragging && 'border-primary bg-accent',
        disabled && 'pointer-events-none opacity-60',
      )}
    >
      {compact ? (
        t('employeeImport.upload.chooseAnother')
      ) : (
        <>
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            <FileUp
              aria-hidden="true"
              className="size-5 text-muted-foreground"
            />
          </span>
          <span className="text-sm font-medium">
            {t('employeeImport.upload.choose')}
          </span>
          <span className="text-[13px] text-muted-foreground">
            {t('employeeImport.upload.hint')}
          </span>
        </>
      )}
      <input
        id={inputId}
        type="file"
        accept={IMPORT_FILE_ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          select(event.target.files[0])
          event.target.value = ''
        }}
      />
    </label>
  )
}

export default FilePicker
