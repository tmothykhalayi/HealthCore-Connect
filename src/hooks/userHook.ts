import { deleteUserFn, getUserFn } from "@/API/users"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetUserQuery = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['users', page, limit, search],
    queryFn: () => getUserFn(page, limit, search),
    keepPreviousData: true,
  });

}
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}
