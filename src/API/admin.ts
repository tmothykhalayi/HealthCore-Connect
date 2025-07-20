import { API_BASE_URL } from './BaseUrl'
import { getAccessTokenHelper } from '@/lib/auth'

// Admin dashboard statistics interface
export interface AdminDashboardStats {
  users: {
    total: number
    active: number
    verified: number
    byRole: {
      doctors: number
      patients: number
      admins: number
      pharmacies: number
    }
  }
  appointments: {
    total: number
    scheduled: number
    completed: number
    cancelled: number
    recent: number
    uniquePatients: number
    uniqueDoctors: number
    completionRate: string
  }
  medicines: {
    total: number
  }
  orders: {
    total: number
    pending: number
    completed: number
    cancelled: number
  }
  payments: {
    total: number
    pending: number
    completed: number
    failed: number
  }
}

// Get comprehensive admin dashboard statistics
export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const token = getAccessTokenHelper()

  try {
    // Fetch all statistics in parallel
    const [userStats, appointmentStats, medicineStats, orderStats, paymentStats] = await Promise.all([
      // User statistics
      fetch(`${API_BASE_URL}/users/stats`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.ok ? res.json() : { data: { total: 0, active: 0, verified: 0, byRole: { doctors: 0, patients: 0, admins: 0, pharmacies: 0 } } }),

      // Appointment statistics (using telemedicine endpoint)
      fetch(`${API_BASE_URL}/telemedicine/stats`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.ok ? res.json() : { data: { total: 0, scheduled: 0, completed: 0, cancelled: 0, recent: 0, uniquePatients: 0, uniqueDoctors: 0, completionRate: '0' } }),

      // Medicine statistics
      fetch(`${API_BASE_URL}/medicines/stats`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.ok ? res.json() : { data: { total: 0 } }),

      // Order statistics
      fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.ok ? res.json() : { data: [] }),

      // Payment statistics
      fetch(`${API_BASE_URL}/payments`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.ok ? res.json() : { data: [] }),
    ])

    // Process order statistics
    const orders = orderStats.data || orderStats
    const orderStatsProcessed = {
      total: orders.length,
      pending: orders.filter((order: any) => order.status === 'pending').length,
      completed: orders.filter((order: any) => order.status === 'completed').length,
      cancelled: orders.filter((order: any) => order.status === 'cancelled').length,
    }

    // Process payment statistics
    const payments = paymentStats.data || paymentStats
    const paymentStatsProcessed = {
      total: payments.length,
      pending: payments.filter((payment: any) => payment.status === 'pending').length,
      completed: payments.filter((payment: any) => payment.status === 'completed').length,
      failed: payments.filter((payment: any) => payment.status === 'failed').length,
    }

    return {
      users: userStats.data || userStats,
      appointments: appointmentStats.data || appointmentStats,
      medicines: medicineStats.data || medicineStats,
      orders: orderStatsProcessed,
      payments: paymentStatsProcessed,
    }
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error)
    // Return default values if any request fails
    return {
      users: {
        total: 0,
        active: 0,
        verified: 0,
        byRole: {
          doctors: 0,
          patients: 0,
          admins: 0,
          pharmacies: 0,
        },
      },
      appointments: {
        total: 0,
        scheduled: 0,
        completed: 0,
        cancelled: 0,
        recent: 0,
        uniquePatients: 0,
        uniqueDoctors: 0,
        completionRate: '0',
      },
      medicines: {
        total: 0,
      },
      orders: {
        total: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
      },
      payments: {
        total: 0,
        pending: 0,
        completed: 0,
        failed: 0,
      },
    }
  }
}

// Get recent activities for admin dashboard
export const getRecentActivities = async () => {
  const token = getAccessTokenHelper()

  try {
    const [recentAppointments, recentOrders, recentPayments] = await Promise.all([
      // Recent appointments
      fetch(`${API_BASE_URL}/telemedicine?limit=5`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.ok ? res.json() : { data: [] }),

      // Recent orders
      fetch(`${API_BASE_URL}/orders?limit=5`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.ok ? res.json() : { data: [] }),

      // Recent payments
      fetch(`${API_BASE_URL}/payments?limit=5`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.ok ? res.json() : { data: [] }),
    ])

    return {
      appointments: recentAppointments.data || recentAppointments,
      orders: recentOrders.data || recentOrders,
      payments: recentPayments.data || recentPayments,
    }
  } catch (error) {
    console.error('Error fetching recent activities:', error)
    return {
      appointments: [],
      orders: [],
      payments: [],
    }
  }
}

// Get admin profile
export const getAdminProfile = async (userId: number) => {
  const token = getAccessTokenHelper()

  const response = await fetch(`${API_BASE_URL}/admin/user/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch admin profile')
  }

  return await response.json()
}

// Get system health status
export const getSystemHealth = async () => {
  const token = getAccessTokenHelper()

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      return await response.json()
    }
    
    return { status: 'unknown', message: 'Unable to check system health' }
  } catch (error) {
    return { status: 'error', message: 'System health check failed' }
  }
} 