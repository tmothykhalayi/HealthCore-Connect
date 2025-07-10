import { createPatientFn, deletePatientFn, getPatientsFn } from "@/API/patients";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetPatientQuery = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['patients', page, limit, search],
    queryFn: () => getPatientsFn(page, limit, search),
  });
}

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatientFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
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