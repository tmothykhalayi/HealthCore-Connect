import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUserFn, deleteUserFn, getUserFn, getCurrentUserProfileFn, getAllUsersFn, updateUserFn } from '@/api/user'

// Hook to get all users without pagination
export const useGetAllUsersQuery = () => {
  return useQuery({
    queryKey: ['all-users'],
    queryFn: getAllUsersFn,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

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

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, userData }: { userId: number; userData: any }) => 
      updateUserFn(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
    },
  })
}

export const useGetCurrentUserProfile = () => {
  return useQuery({
    queryKey: ['current-user-profile'],
    queryFn: getCurrentUserProfileFn,
  })
}
