import {  useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { API_BASE_URL } from './BaseUrl'
import type {UseMutationResult} from '@tanstack/react-query';
import type {
  GlobalDataType,
  LoginPayload,
  LoginResponse,
} from '@/types/alltypes'
import { UserRole } from '@/types/alltypes'
import {
  // authStore
  authActions,
} from '@/app/store'

const loginFn = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_BASE_URL}/auth/signin`,
    {
      ...payload,
    },
  )
  console.log(response.data)
  return response.data
}

export const useLogin = (): UseMutationResult<
  LoginResponse,
  Error,
  LoginPayload
> => {
  return useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      console.log('Login response:', data)
      toast.success(`Welcome, ${data.user?.email || 'User'}!`)

      // Transform backend response to frontend format
      const authData: GlobalDataType = {
        isVerified: true,
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        user: {
          id: data.user?.id || '',
          email: data.user?.email || '',
          role: data.user?.role || UserRole.PATIENT,
        },
      }
      authActions.saveUser(authData)

      // Also save to localStorage for backward compatibility
      localStorage.setItem('auth', JSON.stringify(authData.tokens))
      localStorage.setItem('accesstoken', authData.tokens.accessToken)
      localStorage.setItem('refreshToken', authData.tokens.refreshToken)
    },
    onError: (error: any) => {
      toast.error(
        `Login failed: ${error?.response?.data?.message || error.message}`,
      )
    },
  })
}
