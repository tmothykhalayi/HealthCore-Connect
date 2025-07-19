import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUserFn, deleteUserFn, getUserFn, getCurrentUserProfileFn } from '@/api/user'

export const useGetUserQuery = (
  page: number,
  limit: number,
  search: string,
) => {
  return useQuery({
    queryKey: ['users', page, limit, search],
    queryFn: () => getUserFn(page, limit, search),
  })
}
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Hook to get current user profile with role-specific data
export const useGetCurrentUserProfile = () => {
  return useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: getCurrentUserProfileFn,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
