import { createPrescriptionFn, getPrescriptionFn } from "@/API/doctor API/prescriptions";
import { deletePrescriptionFn } from "@/API/prescriptions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetPrescriptionQuery = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['prescriptions', page, limit, search],
    queryFn: () => getPrescriptionFn(page, limit, search),
  });
}

export const useDeletePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePrescriptionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
}

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrescriptionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
}