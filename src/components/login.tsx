import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks/auth'
import { getUserRole } from '@/lib/auth'
import { useToast } from '@/components/utils/toast-context'

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(3, { message: 'Password must be at least 3 characters' }),
})

export type FormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  
  const login = useLogin()
  const router = useRouter()
  const toast = useToast()

  const validateField = (name: keyof FormData, value: string) => {
    try {
      if (name === 'email') {
        loginSchema.shape.email.parse(value)
      } else if (name === 'password') {
        loginSchema.shape.password.parse(value)
      }
      return undefined
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message
      }
      return 'Invalid input'
    }
  }

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate all fields
    const newErrors: Partial<FormData> = {}
    let hasErrors = false

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof FormData
      const error = validateField(fieldName, formData[fieldName])
      if (error) {
        newErrors[fieldName] = error
        hasErrors = true
      }
    })

    if (hasErrors) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const result = loginSchema.safeParse(formData)
      
      if (!result.success) {
        console.error('Validation failed:', result.error.issues)
        return
      }

      console.log('Attempting login with:', {
        email: result.data.email,
        password: '[HIDDEN]',
      })
      
      const res = await login.mutateAsync(result.data)
      toast?.open('Login successful!')
      console.log('Login response:', res)
      
      // Get user role from the token
      const userRole = getUserRole()

      // Route based on user role
      switch (userRole) {
        case 'admin':
          router.navigate({ to: '/Dashboard/admin/dashboard' })
          break
        case 'doctor':
          router.navigate({ to: '/Dashboard/doctor/appointments' })
          break
        case 'patient':
          router.navigate({ to: '/Dashboard/patient/appointments' })
          break
        case 'pharmacist':
          router.navigate({ to: '/Dashboard/pharmarcist/records' })
          break
        default:
          console.warn('Unknown user role:', userRole)
          toast?.open('User role not found. Please contact support.')
          router.navigate({ to: '/' })
      }
      
      setFormData({ email: '', password: '' })
      setErrors({})
      
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.'

      if (error instanceof Error) {
        errorMessage = error.message
      }
      if (
        errorMessage.toLowerCase().includes('not found') ||
        errorMessage.toLowerCase().includes('no account found')
      ) {
        toast?.open(
          'Account not found. Please check your email or create a new account.',
        )
      } else if (
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('password')
      ) {
        toast?.open(
          'Invalid credentials. Please check your email and password.',
        )
      } else if (
        errorMessage.toLowerCase().includes('network') ||
        errorMessage.toLowerCase().includes('fetch')
      ) {
        toast?.open(
          'Network error. Please check your internet connection and try again.',
        )
      } else {
        toast?.open(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-md border border-gray-200 rounded-xl bg-white">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-violet-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c.943 0 1.815-.613 2-1.529V8.471C13.815 7.557 12.943 7 12 7s-1.815.557-2 1.471v1C10.185 10.387 11.057 11 12 11z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11v3m0 0H9m3 0h3"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Welcome User
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </CardContent>
          </form>
          
          <div className="text-center text-sm mt-4 text-gray-600">
            Don't have an account?{' '}
            <Link to="/registration" className="text-violet-600 hover:underline">
              Sign up for free
            </Link>
            <p className="mt-2 text-xs text-gray-400">
              By signing in, you agree to our{' '}
              <a href="#" className="underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </Card>
    </div>
  )
}
