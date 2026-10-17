import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { t } from 'i18next'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from 'apis/client'
import sessionApi from 'apis/session'
import { routes } from 'routes'
import { hrUser } from '../../test/fixtures'
import { renderApp } from '../../test/utils'

const fillAndSubmit = async (user, { email, password }) => {
  if (email) await user.type(screen.getByLabelText(t('login.email')), email)
  if (password)
    await user.type(screen.getByLabelText(t('login.password')), password)
  await user.click(screen.getByRole('button', { name: t('login.submit') }))
}

describe('Login', () => {
  it('sends signed-out visitors to the login page', async () => {
    renderApp(routes.root)

    expect(
      await screen.findByRole('heading', { name: t('login.title') }),
    ).toBeInTheDocument()
  })

  it('validates the fields before calling the API', async () => {
    const user = userEvent.setup()
    renderApp(routes.login)
    await screen.findByRole('heading', { name: t('login.title') })

    await fillAndSubmit(user, {})

    expect(
      screen.getByText(t('login.validation.emailRequired')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(t('login.validation.passwordRequired')),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(t('login.email'))).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(sessionApi.login).not.toHaveBeenCalled()
  })

  it('shows the server message for invalid credentials and stays on the page', async () => {
    vi.mocked(sessionApi.login).mockRejectedValue(
      new ApiError('Invalid email or password', 401),
    )
    const user = userEvent.setup()
    renderApp(routes.login)
    await screen.findByRole('heading', { name: t('login.title') })

    await fillAndSubmit(user, {
      email: 'hr@acme.test',
      password: 'wrong-password',
    })

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Invalid email or password',
    )
    expect(
      screen.getByRole('heading', { name: t('login.title') }),
    ).toBeInTheDocument()
  })

  it('signs in with a trimmed email and opens the home page', async () => {
    vi.mocked(sessionApi.login).mockResolvedValue(hrUser)
    const user = userEvent.setup()
    renderApp(routes.login)
    await screen.findByRole('heading', { name: t('login.title') })

    await fillAndSubmit(user, {
      email: '  hr@acme.test ',
      password: 'correct-horse-battery',
    })

    expect(
      await screen.findByRole('heading', { name: t('home.title') }),
    ).toBeInTheDocument()
    expect(vi.mocked(sessionApi.login).mock.calls[0][0]).toEqual({
      email: 'hr@acme.test',
      password: 'correct-horse-battery',
    })
  })
})
