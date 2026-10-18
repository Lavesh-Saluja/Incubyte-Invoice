import { useMutation, useQueryClient } from '@tanstack/react-query'
import employeeImportsApi from 'apis/employeeImports'
import { QUERY_KEYS } from 'constants/query'

export const usePreviewEmployeeImport = () =>
  useMutation({ mutationFn: employeeImportsApi.preview })

export const useCreateEmployeeImport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: employeeImportsApi.create,
    onSuccess: () =>
      [
        QUERY_KEYS.EMPLOYEES,
        QUERY_KEYS.SELECT_OPTIONS,
        QUERY_KEYS.DASHBOARD,
        QUERY_KEYS.DEPARTMENTS,
      ].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] })),
  })
}
