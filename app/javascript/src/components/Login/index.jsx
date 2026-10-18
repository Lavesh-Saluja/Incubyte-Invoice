import { Form, Formik } from 'formik'
import { Building2, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation } from 'react-router'
import FormField from 'components/commons/FormField'
import Spinner from 'components/commons/Spinner'
import SubmitButton from 'components/commons/SubmitButton'
import { Input } from 'components/ui/input'
import { useCurrentUser, useLogin } from 'hooks/reactQuery/useSession'
import { routes } from 'routes'
import { getErrorMessage } from 'utils/errors'
import { FIELD_IDS, FORM_ERROR_ID, INITIAL_VALUES } from './constants'
import PasswordInput from './PasswordInput'
import { loginSchema } from './utils'

const Brand = ({ className }) => {
  const { t } = useTranslation()

  return (
    <div className={className}>
      <span className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-white">
        <Building2 className="size-5" />
      </span>
      {t('app.name')}
    </div>
  )
}

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
    <main className="grid min-h-svh lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-sidebar p-12 lg:flex">
        <Brand className="flex items-center gap-3 text-lg font-semibold text-white" />
        <div className="max-w-md">
          <p className="text-3xl leading-tight font-semibold tracking-tight text-white">
            {t('login.tagline')}
          </p>
          <p className="mt-4 text-sm text-sidebar-foreground">
            {t('login.taglineDetail')}
          </p>
        </div>
        <p className="text-xs text-sidebar-foreground">{t('login.footer')}</p>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Brand className="mb-10 flex items-center gap-3 text-lg font-semibold lg:hidden" />
          <h1 className="text-[28px] leading-9 font-semibold">
            {t('login.title')}
          </h1>
          <p className="mt-1 mb-8 text-sm text-muted-foreground">
            {t('login.description')}
          </p>

          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={loginSchema()}
            validateOnMount
            onSubmit={handleSubmit}
          >
            {({ status }) => (
              <Form
                noValidate
                className="flex flex-col gap-5"
                aria-describedby={status ? FORM_ERROR_ID : undefined}
              >
                {status && (
                  <p
                    id={FORM_ERROR_ID}
                    role="alert"
                    className="rounded-md border border-destructive/20 bg-destructive-surface px-3 py-2.5 text-[13px] text-destructive"
                  >
                    {status}
                  </p>
                )}
                <FormField
                  name="email"
                  id={FIELD_IDS.email}
                  label={t('login.email')}
                >
                  {({ field, ariaProps }) => (
                    <div className="relative">
                      <Mail
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        type="email"
                        autoComplete="username"
                        autoFocus
                        placeholder={t('login.emailPlaceholder')}
                        className="pl-9"
                        {...field}
                        {...ariaProps}
                      />
                    </div>
                  )}
                </FormField>
                <FormField
                  name="password"
                  id={FIELD_IDS.password}
                  label={t('login.password')}
                >
                  {({ field, ariaProps }) => (
                    <PasswordInput {...field} {...ariaProps} />
                  )}
                </FormField>
                <SubmitButton className="mt-1 w-full">
                  {t('login.submit')}
                </SubmitButton>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </main>
  )
}

export default Login
