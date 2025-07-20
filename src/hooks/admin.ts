import { useQuery } from '@tanstack/react-query'
import { 
  getAdminDashboardStats, 
  getRecentActivities, 
  getSystemHealth 
} from '@/api/admin'

// Hook to fetch admin dashboard statistics
export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: getAdminDashboardStats,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 60000, // Consider data stale after 1 minute
  })
}

// Hook to fetch recent activities
export const useRecentActivities = () => {
  return useQuery({
    queryKey: ['admin-recent-activities'],
    queryFn: getRecentActivities,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  })
}

// Hook to fetch system health
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['admin-system-health'],
    queryFn: getSystemHealth,
    refetchInterval: 120000, // Refetch every 2 minutes
    staleTime: 60000, // Consider data stale after 1 minute
  })
} 