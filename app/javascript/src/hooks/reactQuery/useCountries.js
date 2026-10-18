import { useQuery } from '@tanstack/react-query'
import countriesApi from 'apis/countries'
import { QUERY_KEYS } from 'constants/query'

export const useCountries = () =>
  useQuery({
    queryKey: [QUERY_KEYS.COUNTRIES],
    queryFn: ({ signal }) => countriesApi.list({ signal }),
    staleTime: Infinity,
  })
