import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import departmentsApi from 'apis/departments'
import { QUERY_KEYS } from 'constants/query'

export const useFetchDepartments = () =>
  useQuery({
    queryKey: [QUERY_KEYS.DEPARTMENTS],
    queryFn: ({ signal }) => departmentsApi.list({ signal }),
  })

export const useCreateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: departmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEPARTMENTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SELECT_OPTIONS] })
    },
  })
}
