import { getRecordsFn } from "@/api/doctor/medcalrecords";
import { useQuery } from "@tanstack/react-query";


export const useGetRecordsQuery = () => {
    return useQuery({
        queryKey: ['records'],
        queryFn: getRecordsFn,
    });
}