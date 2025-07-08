import { loginFn } from '@/API/auth'
import type { loginResponse, loginType } from '@/Types/types'
import { useMutation } from '@tanstack/react-query'

export const useLoginHook = () => {
  return useMutation <loginResponse, Error, loginType>({
    mutationKey: ['login'],
    mutationFn: (data: loginType) => loginFn(data.email, data.password),
    
  })

}
