import { loginFn } from '@/API/auth'
import type { loginResponse, loginType } from '@/Types/types'
import { useMutation } from '@tanstack/react-query'

export const useLoginHook = () => {
  return useMutation <loginResponse, Error, loginType>({
    mutationKey: ['login'],
    mutationFn: (data: loginType) => loginFn(data.email, data.password),
    onSuccess: (data) => {
      // Handle successful login, e.g., store tokens, redirect, etc.    onError: (error) => {
      // Handle login error, e.g., show error message
      console.error('Login failed:', error)
    },
  })

}
