import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { t } from 'i18next'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from 'apis/client'
import sessionApi from 'apis/session'
import { routes } from 'routes'
import { hrUser } from '../../test/fixtures'
import { renderApp } from '../../test/utils'

describe('App layout', () => {
  it('logs out and returns to the login page', async () => {
    vi.mocked(sessionApi.current).mockResolvedValue(hrUser)
    const user = userEvent.setup()
    renderApp(routes.root)

    await user.click(
      await screen.findByRole('button', { name: t('header.logout') }),
    )

    expect(sessionApi.logout).toHaveBeenCalled()
    expect(
      await screen.findByRole('heading', { name: t('login.title') }),
    ).toBeInTheDocument()
  })

  it('stays signed in and shows the error when logout fails', async () => {
    vi.mocked(sessionApi.current).mockResolvedValue(hrUser)
    vi.mocked(sessionApi.logout).mockRejectedValue(
      new ApiError('Could not reach the server.', 0),
    )
    const user = userEvent.setup()
    renderApp(routes.root)

    await user.click(
      await screen.findByRole('button', { name: t('header.logout') }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not reach the server.',
    )
    expect(
      screen.getByRole('heading', { name: t('home.title') }),
    ).toBeInTheDocument()
  })
})
