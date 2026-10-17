import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from './client'

vi.unmock('apis/session')
const { default: sessionApi } = await import('./session')

const respond = (body, status = 200) =>
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(body === undefined ? null : JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  )

describe('sessionApi', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns the signed-in user', async () => {
    respond({ user: { id: '1', name: 'HR' } })

    await expect(sessionApi.current()).resolves.toEqual({ id: '1', name: 'HR' })
  })

  it('returns null when nobody is signed in', async () => {
    respond({ error: 'Please sign in to continue' }, 401)

    await expect(sessionApi.current()).resolves.toBeNull()
  })

  it('still throws other failures', async () => {
    respond({ error: 'boom' }, 500)

    await expect(sessionApi.current()).rejects.toBeInstanceOf(ApiError)
  })

  it('posts the credentials wrapped in session and unwraps the user', async () => {
    respond({ user: { id: '1' } })

    const user = await sessionApi.login({
      email: 'hr@acme.test',
      password: 'pw',
    })

    expect(user).toEqual({ id: '1' })
    const [url, init] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe('/api/session')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({
      session: { email: 'hr@acme.test', password: 'pw' },
    })
  })

  it('logs out with DELETE', async () => {
    respond(undefined, 204)

    await sessionApi.logout()

    expect(vi.mocked(fetch).mock.calls[0][1].method).toBe('DELETE')
  })
})
