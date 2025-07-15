import { createRecordFn, deleteRecordFn, getRecordFn } from "@/API/records";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetRecordsQuery = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['records', page, limit, search],
    queryFn: () => getRecordFn(page, limit, search),
  });
}

export const useDeleteRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecordFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });
}

export const useCreateRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordData: any) => createRecordFn(recordData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });
}