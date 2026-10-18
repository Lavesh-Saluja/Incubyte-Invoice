import { useField } from 'formik'
import { useTranslation } from 'react-i18next'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'

const FormField = ({
  name,
  id = name,
  label,
  required = false,
  hint,
  children,
  ...inputProps
}) => {
  const { t } = useTranslation()
  const [field, meta, helpers] = useField(name)
  const error = meta.touched && meta.error
  const messageId = `${id}-message`
  const ariaProps = {
    id,
    'aria-invalid': Boolean(error),
    'aria-required': required || undefined,
    'aria-describedby': error || hint ? messageId : undefined,
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="gap-0.5 text-[13px] font-medium">
        {label}
        {required && (
          <span aria-hidden="true" className="text-destructive">
            {t('common.requiredMark')}
          </span>
        )}
      </Label>
      {children ? (
        children({ field, helpers, ariaProps })
      ) : (
        <Input {...field} {...ariaProps} {...inputProps} />
      )}
      {error ? (
        <p
          id={messageId}
          className="text-xs text-destructive first-letter:uppercase"
        >
          {error}
        </p>
      ) : (
        hint && (
          <p id={messageId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

export default FormField
