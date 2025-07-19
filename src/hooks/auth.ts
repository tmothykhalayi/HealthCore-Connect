import { loginFn } from '@/api/auth'
import type { loginType } from '@/types/alltypes'
import { useMutation } from '@tanstack/react-query'
import useAuthStore from '@/store/auth'

export const useLoginHook = () => {
  return useMutation<any, Error, loginType>({
    mutationKey: ['login'],
    mutationFn: (data: loginType) => loginFn(data.email, data.password),
  })
}

// Create useLogin hook using the existing loginFn
export const useLogin = () => {
  return useMutation<any, Error, loginType>({
    mutationKey: ['login'],
    mutationFn: (data: loginType) => loginFn(data.email, data.password),
  })
}

// Hook to get current user from auth store
export const useCurrentUser = () => {
  const user = useAuthStore((state: any) => state.user)
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated)
  
  return {
    data: user,
    isLoading: false, // Since this is from local store, it's always loaded
    isAuthenticated
  }
}

// Hook to get user role from auth store
export const useUserRole = () => {
  const user = useAuthStore((state: any) => state.user)
  return user?.role || null
}

// Signup hook
export const useSignup = () => {
  return useMutation<any, Error, any>({
    mutationKey: ['signup'],
    mutationFn: async (data: any) => {
      // For now, just simulate a signup
      console.log('Signup data:', data)
      return { user: data, success: true }
    },
  })
}

// Profile creation hooks
export const useCreatePatientProfile = () => {
  return useMutation<any, Error, any>({
    mutationKey: ['createPatientProfile'],
    mutationFn: async (data: any) => {
      console.log('Creating patient profile:', data)
      return { success: true }
    },
  })
}

export const useCreateDoctorProfile = () => {
  return useMutation<any, Error, any>({
    mutationKey: ['createDoctorProfile'],
    mutationFn: async (data: any) => {
      console.log('Creating doctor profile:', data)
      return { success: true }
    },
  })
}

export const useCreatePharmacistProfile = () => {
  return useMutation<any, Error, any>({
    mutationKey: ['createPharmacistProfile'],
    mutationFn: async (data: any) => {
      console.log('Creating pharmacist profile:', data)
      return { success: true }
    },
  })
}