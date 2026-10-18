import { useQuery } from '@tanstack/react-query'
import dashboardApi from 'apis/dashboard'
import { QUERY_KEYS } from 'constants/query'

export const useDashboard = () =>
  useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: ({ signal }) => dashboardApi.show({ signal }),
  })
