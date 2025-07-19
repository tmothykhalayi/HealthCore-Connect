import { useQuery } from '@tanstack/react-query'
import { getRecordsFn } from '@/api/doctor/medcalrecords'

export const useGetRecordsQuery = () => {
  return useQuery({
    queryKey: ['records'],
    queryFn: getRecordsFn,
  })
}
