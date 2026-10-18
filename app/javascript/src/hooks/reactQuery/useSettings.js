import { useQuery } from '@tanstack/react-query'
import settingsApi from 'apis/settings'
import { QUERY_KEYS } from 'constants/query'

export const useSettings = () =>
  useQuery({
    queryKey: [QUERY_KEYS.SETTINGS],
    queryFn: ({ signal }) => settingsApi.show({ signal }),
    staleTime: Infinity,
  })
