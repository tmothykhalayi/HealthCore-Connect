import { deletePatientFn, getPatientsFn } from "@/API/patients";
import type { TPatient } from "@/Types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetPatientQuery = (page: number, limit: number, search: string) => {
  return useQuery<{
    patients: TPatient[];
    total: number;
  }>({
    queryKey: ['patients', page, limit, search],
    queryFn: () => getPatientsFn(page, limit, search),
  });
}
export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePatientFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}