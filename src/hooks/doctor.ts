import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteDoctorFn, getDoctorFn, getDoctorByIdFn, createDoctorFn, updateDoctorFn } from '@/API/doctor'

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

export const useGetDoctorByUserId = (userId: number) => {
  return useQuery({
    queryKey: ['doctor', 'user', userId],
    queryFn: () => getDoctorByUserIdFn(userId),
    enabled: !!userId,
    staleTime: 0, // Always consider data stale to force refresh
    refetchOnWindowFocus: true,
  })
}

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ doctorId, doctorData }: { doctorId: number; doctorData: any }) => {
      console.log('useUpdateDoctor mutationFn called with:', { doctorId, doctorData });
      return updateDoctorFn(doctorId, doctorData);
    },
    onSuccess: (data, variables) => {
      console.log('useUpdateDoctor onSuccess called with:', { data, variables });
      // Invalidate all doctor-related queries
      queryClient.invalidateQueries({ queryKey: ['doctors'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['doctor'], exact: false });
      queryClient.refetchQueries({ queryKey: ['doctors'], exact: false });
      queryClient.refetchQueries({ queryKey: ['doctor'], exact: false });
    },
    onError: (error, variables) => {
      console.error('useUpdateDoctor onError called with:', { error, variables });
    }
  })
}
