import { useQuery } from '@tanstack/react-query'
import { getPatientMedicalRecordsFn } from '@/api/patient/medicalRecords'

export const useGetPatientMedicalRecordsQuery = (patientId: number) => {
  return useQuery({
    queryKey: ['patientMedicalRecords', patientId],
    queryFn: () => getPatientMedicalRecordsFn(patientId),
    enabled: !!patientId, // Only run query if patientId is provided
  })
} 