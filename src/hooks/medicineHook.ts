import { deleteMedicinesFn, getMedicinesFn } from "@/API/medicines";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMedicineQuery = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['medicines', page, limit, search],
    queryFn: () => getMedicinesFn(page, limit, search),
  });
}

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMedicinesFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}