import { useQuery } from '@tanstack/react-query'
import { getPharmacies } from '@/api/pharmacy'

export const useGetPharmacies = () => {
  return useQuery({
    queryKey: ['pharmacies'],
    queryFn: getPharmacies,
  })
}
