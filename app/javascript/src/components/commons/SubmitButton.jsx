import { useFormikContext } from 'formik'
import LoadingButton from 'components/commons/LoadingButton'

const SubmitButton = ({ requireChanges = true, children, ...props }) => {
  const { isSubmitting, isValid, dirty } = useFormikContext()

  return (
    <LoadingButton
      type="submit"
      loading={isSubmitting}
      disabled={!isValid || (requireChanges && !dirty)}
      {...props}
    >
      {children}
    </LoadingButton>
  )
}

export default SubmitButton
