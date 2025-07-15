import { getPrescriptionFn } from "@/API/doctor API/prescriptions";
import { deletePrescriptionFn, getPrescriptionsFn} from "@/API/prescriptions";
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




