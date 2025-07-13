import { getMedicineFn } from "@/API/patient Api/medicines";
import { useQuery } from "@tanstack/react-query";


export const useGetMedicineQuery = () => {
    return useQuery({
        queryKey: ['medicines'],
        queryFn: getMedicineFn,
    });
}