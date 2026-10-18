import { useField } from 'formik'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'

const FormField = ({ name, id = name, label, children, ...inputProps }) => {
  const [field, meta, helpers] = useField(name)
  const error = meta.touched && meta.error
  const errorId = `${id}-error`
  const ariaProps = {
    id,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children ? (
        children({ field, helpers, ariaProps })
      ) : (
        <Input {...field} {...ariaProps} {...inputProps} />
      )}
      {error && (
        <p
          id={errorId}
          className="text-sm text-destructive first-letter:uppercase"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
