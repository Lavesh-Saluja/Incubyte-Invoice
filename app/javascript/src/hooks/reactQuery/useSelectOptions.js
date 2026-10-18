import { useQuery } from '@tanstack/react-query'
import selectOptionsApi from 'apis/selectOptions'
import { QUERY_KEYS } from 'constants/query'

export const useCountries = ({ inUse = false } = {}) =>
  useQuery({
    queryKey: [QUERY_KEYS.SELECT_OPTIONS, 'countries', { inUse }],
    queryFn: ({ signal }) => selectOptionsApi.countries({ inUse }, { signal }),
    staleTime: inUse ? undefined : Infinity,
  })

export const useDepartments = () =>
  useQuery({
    queryKey: [QUERY_KEYS.SELECT_OPTIONS, 'departments'],
    queryFn: ({ signal }) => selectOptionsApi.departments({ signal }),
  })
