import { getDoctorFn } from "@/API/patientDoc";
import { useQuery} from "@tanstack/react-query";

export const useGetDoctorQuery = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['doctors', page, limit, search],
    queryFn: () => getDoctorFn(page, limit, search),

  });
}

