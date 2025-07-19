import { loginFn } from '@/api/auth'
import type { loginResponse, loginType } from '@/types/alltypes'
import { useMutation } from '@tanstack/react-query'

export const useLoginHook = () => {
  return useMutation <loginResponse, Error, loginType>({
    mutationKey: ['login'],
    mutationFn: (data: loginType) => loginFn(data.email, data.password),
    
  })

}