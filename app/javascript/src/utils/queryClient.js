import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { HTTP_STATUS } from 'constants/api'
import {
  MAX_QUERY_RETRIES,
  QUERY_KEYS,
  QUERY_STALE_TIME_MS,
} from 'constants/query'

// Retry only failures that may be transient (network errors and 5xx), never 4xx.
const shouldRetry = (failureCount, error) => {
  const status = error?.status
  const transient =
    status === HTTP_STATUS.NETWORK_ERROR ||
    status >= HTTP_STATUS.INTERNAL_SERVER_ERROR

  return transient && failureCount < MAX_QUERY_RETRIES
}

export const clearSignedInState = (queryClient) => {
  queryClient.removeQueries({
    predicate: ({ queryKey }) => queryKey[0] !== QUERY_KEYS.CURRENT_USER,
  })
  queryClient.setQueryData([QUERY_KEYS.CURRENT_USER], null)
}

export const createQueryClient = (overrides = {}) => {
  const handleError = (error) => {
    if (error?.status === HTTP_STATUS.UNAUTHORIZED)
      clearSignedInState(queryClient)
  }

  const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError: handleError }),
    mutationCache: new MutationCache({ onError: handleError }),
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        refetchOnWindowFocus: false,
        retry: shouldRetry,
        ...overrides.queries,
      },
      mutations: { retry: false, ...overrides.mutations },
    },
  })

  return queryClient
}
