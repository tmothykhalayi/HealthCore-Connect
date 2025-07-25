import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteDoctorFn, getDoctorFn, getDoctorByIdFn, createDoctorFn, updateDoctorFn } from '@/api/doctor'

export const useGetDoctorQuery = (
  page: number,
  limit: number,
  search: string,
) => {
  return useQuery({
    queryKey: ['doctors', page, limit, search],
    queryFn: () => getDoctorFn(page, limit, search),
    staleTime: 0, // Always consider data stale to force refresh
    refetchOnWindowFocus: true,
  })
}

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDoctorFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
    },
  })
}

export const useGetDoctorById = (doctorId: number) => {
  return useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => getDoctorByIdFn(doctorId),
    enabled: !!doctorId,
  })
}

export const useCreateDoctor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDoctorFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
    },
  })
}

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ doctorId, doctorData }: { doctorId: number; doctorData: any }) => updateDoctorFn(doctorId, doctorData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'], exact: false });
      queryClient.refetchQueries({ queryKey: ['doctors'], exact: false });
    },
  })
}
