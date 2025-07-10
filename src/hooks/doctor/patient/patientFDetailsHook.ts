import { getPatientDetailsFn } from "@/API/doctor API/patient/patientDetails";
import { useQuery } from "@tanstack/react-query";


export const useGetPatientDetailsQuery = (patientId: number) => {
  return useQuery({
    queryKey: ['patientDetails', patientId],
    queryFn: () => getPatientDetailsFn(patientId),
  });
}