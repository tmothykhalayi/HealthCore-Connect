import { getRecordsFn } from "@/API/doctor API/records";
import { useQuery } from "@tanstack/react-query";


export const useGetRecordsQuery = () => {
    return useQuery({
        queryKey: ['records'],
        queryFn: getRecordsFn,
    });
}