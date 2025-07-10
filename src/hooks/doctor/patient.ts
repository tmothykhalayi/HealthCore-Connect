import { getPatientsFn } from "@/API/patients";
import { useQuery } from "@tanstack/react-query";


export const useGetPatientsQuery = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: () => getPatientsFn(),
  });
};
