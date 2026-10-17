import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import employeesApi from 'apis/employees'
import { QUERY_KEYS } from 'constants/query'

const listKey = [QUERY_KEYS.EMPLOYEES, 'list']
const employeeKey = (id) => [QUERY_KEYS.EMPLOYEES, id]

export const useFetchEmployees = ({ page, perPage }) =>
  useQuery({
    queryKey: [...listKey, { page, perPage }],
    queryFn: ({ signal }) => employeesApi.list({ page, perPage }, { signal }),
    placeholderData: keepPreviousData,
  })

export const useShowEmployee = (id) =>
  useQuery({
    queryKey: employeeKey(id),
    queryFn: ({ signal }) => employeesApi.show(id, { signal }),
  })

const useSaveEmployee = (mutationFn) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (employee) => {
      queryClient.setQueryData(employeeKey(employee.id), employee)
      queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
}

export const useCreateEmployee = () => useSaveEmployee(employeesApi.create)

export const useUpdateEmployee = () => useSaveEmployee(employeesApi.update)
