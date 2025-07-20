import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPatientFn, deletePatientFn, getPatientsFn, updatePatientFn, getPatientByIdFn, getPatientByUserIdFn, getAllPatientsFn } from '@/api/patient'
import type { patient } from '@/api/patient'

// Hook to get all patients without pagination
export const useGetAllPatientsQuery = () => {
  return useQuery({
    queryKey: ['all-patients'],
    queryFn: getAllPatientsFn,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export const useGetPatientQuery = (
  page: number,
  limit: number,
  search: string,
) => {
  return useQuery({
    queryKey: ['patients', page, limit, search],
    queryFn: () => getPatientsFn(page, limit, search),
  })
}

export const useCreatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPatientFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['all-patients'] })
    },
  })
}

export const useDeletePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePatientFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['all-patients'] })
    },
  })
}

export const useUpdatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ patientId, patientData }: { patientId: number; patientData: Partial<patient> }) =>
      updatePatientFn(patientId, patientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['all-patients'] })
    },
  })
}

export const useGetPatientById = (patientId: number) => {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatientByIdFn(patientId),
    enabled: !!patientId,
  })
}

export const useGetPatientByUserId = (userId: number) => {
  return useQuery({
    queryKey: ['patient-by-user', userId],
    queryFn: () => getPatientByUserIdFn(userId),
    enabled: !!userId,
  })
}
