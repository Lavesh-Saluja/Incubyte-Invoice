import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation } from 'react-router'
import FormField from 'components/commons/FormField'
import Spinner from 'components/commons/Spinner'
import SubmitButton from 'components/commons/SubmitButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'components/ui/card'
import { useCurrentUser, useLogin } from 'hooks/reactQuery/useSession'
import { routes } from 'routes'
import { getErrorMessage } from 'utils/errors'
import { FIELD_IDS, FORM_ERROR_ID, INITIAL_VALUES } from './constants'
import { loginSchema } from './utils'

const Login = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { data: user, isPending: isCheckingSession } = useCurrentUser()
  const { mutateAsync: login } = useLogin()

  if (isCheckingSession)
    return <Spinner label={t('auth.checking')} className="min-h-svh" />
  if (user) return <Navigate to={location.state?.from ?? routes.root} replace />

  const handleSubmit = async ({ email, password }, { setStatus }) => {
    setStatus(null)
    try {
      await login({ email: email.trim(), password })
    } catch (error) {
      setStatus(getErrorMessage(error))
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h1 className="text-xl">{t('login.title')}</h1>
          </CardTitle>
          <CardDescription>{t('login.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={loginSchema()}
            validateOnMount
            onSubmit={handleSubmit}
          >
            {({ status }) => (
              <Form
                noValidate
                className="flex flex-col gap-4"
                aria-describedby={status ? FORM_ERROR_ID : undefined}
              >
                {status && (
                  <p
                    id={FORM_ERROR_ID}
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                  >
                    {status}
                  </p>
                )}
                <FormField
                  name="email"
                  id={FIELD_IDS.email}
                  label={t('login.email')}
                  type="email"
                  autoComplete="username"
                  autoFocus
                />
                <FormField
                  name="password"
                  id={FIELD_IDS.password}
                  label={t('login.password')}
                  type="password"
                  autoComplete="current-password"
                />
                <SubmitButton className="w-full">
                  {t('login.submit')}
                </SubmitButton>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </main>
  )
}

export default Login
