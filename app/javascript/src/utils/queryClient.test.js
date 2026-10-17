import { describe, expect, it } from 'vitest'
import { ApiError } from 'apis/client'
import { QUERY_KEYS } from 'constants/query'
import { createQueryClient } from './queryClient'

describe('createQueryClient', () => {
  it('signs the user out locally and drops cached data on any 401', async () => {
    const queryClient = createQueryClient({ queries: { retry: false } })
    queryClient.setQueryData([QUERY_KEYS.CURRENT_USER], { id: '1' })
    queryClient.setQueryData(['employees'], [{ salary: 1 }])

    await queryClient
      .fetchQuery({
        queryKey: ['salaries'],
        queryFn: () => Promise.reject(new ApiError('Please sign in', 401)),
      })
      .catch(() => {})

    expect(queryClient.getQueryData([QUERY_KEYS.CURRENT_USER])).toBeNull()
    expect(queryClient.getQueryData(['employees'])).toBeUndefined()
  })

  it('keeps the user on other errors', async () => {
    const queryClient = createQueryClient({ queries: { retry: false } })
    queryClient.setQueryData([QUERY_KEYS.CURRENT_USER], { id: '1' })

    await queryClient
      .fetchQuery({
        queryKey: ['salaries'],
        queryFn: () => Promise.reject(new ApiError('Forbidden', 403)),
      })
      .catch(() => {})

    expect(queryClient.getQueryData([QUERY_KEYS.CURRENT_USER])).toEqual({
      id: '1',
    })
  })
})
