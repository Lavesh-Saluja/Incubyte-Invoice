import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation } from 'react-router'
import FullPageStatus from 'components/commons/FullPageStatus'
import { Button } from 'components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'components/ui/card'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { useCurrentUser, useLogin } from 'hooks/reactQuery/useSession'
import { routes } from 'routes'
import { getErrorMessage } from 'utils/errors'
import { FIELD_IDS, FORM_ERROR_ID } from './constants'
import { errorId, validateCredentials } from './utils'

const INITIAL_VALUES = { email: '', password: '' }

const Login = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { data: user, isPending: isCheckingSession } = useCurrentUser()
  const login = useLogin()
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})

  if (isCheckingSession)
    return <FullPageStatus>{t('auth.checking')}</FullPageStatus>
  // Signed in (already, or just now): continue to the page they first asked for.
  if (user) return <Navigate to={location.state?.from ?? routes.root} replace />

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const clientErrors = validateCredentials(values)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return

    login.mutate({ email: values.email.trim(), password: values.password })
  }

  const fieldProps = (name) => ({
    id: FIELD_IDS[name],
    name,
    value: values[name],
    onChange: handleChange,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? errorId(FIELD_IDS[name]) : undefined,
  })

  const renderFieldError = (name) =>
    errors[name] && (
      <p id={errorId(FIELD_IDS[name])} className="text-sm text-destructive">
        {errors[name]}
      </p>
    )

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
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
            aria-describedby={login.isError ? FORM_ERROR_ID : undefined}
          >
            {login.isError && (
              <p
                id={FORM_ERROR_ID}
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              >
                {getErrorMessage(login.error)}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor={FIELD_IDS.email}>{t('login.email')}</Label>
              <Input
                {...fieldProps('email')}
                type="email"
                autoComplete="username"
                autoFocus
              />
              {renderFieldError('email')}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={FIELD_IDS.password}>{t('login.password')}</Label>
              <Input
                {...fieldProps('password')}
                type="password"
                autoComplete="current-password"
              />
              {renderFieldError('password')}
            </div>

            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? t('login.submitting') : t('login.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default Login
