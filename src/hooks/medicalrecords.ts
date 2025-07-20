import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getRecordFn,
  deleteRecordFn,
  createRecordFn,
  updateRecordFn,
} from '@/api/medicalrecords'
import type { CreateRecordData, UpdateRecordData } from '@/types/alltypes'

export const useGetRecordsQuery = (
  page = 1,
  limit = 10,
  search = '',
) => {
  return useQuery({
    queryKey: ['records', page, limit, search],
    queryFn: () => getRecordFn(page, limit, search),
  })
}

export const useDeleteRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRecordFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] })
    },
  })
}

export const useCreateRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRecordFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] })
    },
  })
}

export const useUpdateRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ recordId, recordData }: { recordId: number; recordData: UpdateRecordData }) =>
      updateRecordFn(recordId, recordData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] })
    },
  })
}
