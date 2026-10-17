import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import sessionApi from 'apis/session'
import { QUERY_KEYS } from 'constants/query'
import { clearSignedInState } from 'utils/queryClient'

const currentUserKey = [QUERY_KEYS.CURRENT_USER]

export const useCurrentUser = () =>
  useQuery({
    queryKey: currentUserKey,
    queryFn: ({ signal }) => sessionApi.current({ signal }),
    staleTime: Infinity,
  })

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sessionApi.login,
    onSuccess: (user) => queryClient.setQueryData(currentUserKey, user),
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sessionApi.logout,
    onSuccess: () => clearSignedInState(queryClient),
  })
}
