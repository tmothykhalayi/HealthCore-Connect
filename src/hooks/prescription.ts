import { getPrescriptionFn } from "@/API/doctor API/prescriptions";
import { createPrescriptionFn, deletePrescriptionFn, getPrescriptionsFn, updatePrescriptionFn } from "@/API/prescriptions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetPrescriptionQuery = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['prescriptions', page, limit, search],
    queryFn: () => getPrescriptionsFn(page, limit, search),

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

// Query for single prescription
export const useGetSinglePrescription = (prescriptionId: number) => {
  return useQuery({
    queryKey: ['prescription', prescriptionId],
    queryFn: () => getPrescriptionFn(prescriptionId),
    enabled: !!prescriptionId, 
  });
}

// Mutation for creating prescription
export const useCreatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrescriptionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
}

// Mutation for updating prescription
export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePrescriptionFn,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['prescription', variables.prescriptionId] });
    },
  });
}
