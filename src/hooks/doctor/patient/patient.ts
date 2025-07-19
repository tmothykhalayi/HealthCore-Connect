import { useQuery } from "@tanstack/react-query";
import { getPatientPrescriptionsByIdFn } from "@/api/doctor/patient/patient";

export const useGetPatientPrescriptionsQuery = (patientId: number) => {
  return useQuery({
    queryKey: ['patientPrescriptions', patientId],
    queryFn: () => getPatientPrescriptionsByIdFn(patientId),
  });
}