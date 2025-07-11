import { useQuery } from "@tanstack/react-query";
import { getPatientPrescriptionsByIdFn } from "@/API/doctor API/patient/patientId";

export const useGetPatientPrescriptionsQuery = (patientId: number) => {
  return useQuery({
    queryKey: ['patientPrescriptions', patientId],
    queryFn: () => getPatientPrescriptionsByIdFn(patientId),
  });
}