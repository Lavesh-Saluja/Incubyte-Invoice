import { screen } from '@testing-library/react'
import { t } from 'i18next'
import { describe, expect, it, vi } from 'vitest'
import sessionApi from 'apis/session'
import { routes } from 'routes'
import { hrUser } from './test/fixtures'
import { renderApp } from './test/utils'

describe('App', () => {
  it('sends signed-out visitors to the login page', async () => {
    renderApp(routes.root)

    expect(
      await screen.findByRole('heading', { name: t('login.title') }),
    ).toBeInTheDocument()
  })

  it('shows the home page and the user to a signed-in HR user', async () => {
    vi.mocked(sessionApi.current).mockResolvedValue(hrUser)
    renderApp(routes.root)

    expect(
      await screen.findByRole('heading', { name: t('home.title') }),
    ).toBeInTheDocument()
    expect(screen.getByText(hrUser.name)).toBeInTheDocument()
  })

  it('shows the not found page for unknown paths', async () => {
    renderApp('/does-not-exist')

    expect(
      await screen.findByRole('heading', { name: t('notFound.title') }),
    ).toBeInTheDocument()
  })
})
