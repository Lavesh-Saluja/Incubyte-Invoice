import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import exportsApi from 'apis/exports'
import { QUERY_KEYS } from 'constants/query'
import { EXPORT_POLL_INTERVAL_MS } from 'constants/exports'
import { isActiveExport } from 'utils/exports'

const exportsKey = [QUERY_KEYS.EXPORTS]

export const useFetchExports = () =>
  useQuery({
    queryKey: exportsKey,
    queryFn: ({ signal }) => exportsApi.list({ signal }),
    refetchInterval: ({ state }) =>
      state.data?.some(isActiveExport) ? EXPORT_POLL_INTERVAL_MS : false,
  })

export const useCreateExport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: exportsApi.create,
    onSuccess: (created) =>
      queryClient.setQueryData(exportsKey, (current = []) => [
        created,
        ...current.map((item) =>
          isActiveExport(item) ? { ...item, status: 'cancelled' } : item,
        ),
      ]),
  })
}
