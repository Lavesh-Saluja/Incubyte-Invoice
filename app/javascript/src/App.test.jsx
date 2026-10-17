import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from './test/utils'

describe('App', () => {
  it('shows the home page at the root path', async () => {
    renderApp('/')

    expect(
      await screen.findByRole('heading', { name: 'Sample items' }),
    ).toBeInTheDocument()
  })

  it('shows the not found page for unknown paths', async () => {
    renderApp('/does-not-exist')

    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})
