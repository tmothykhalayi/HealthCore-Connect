import { getDoctorsFn } from "@/API/patient Api/doctors/doctors"
import { useQuery } from "@tanstack/react-query"


export const useGetDoctorQuery = () => {
    return useQuery({
        queryKey: ['doctors'],
        queryFn: getDoctorsFn,
    })
}