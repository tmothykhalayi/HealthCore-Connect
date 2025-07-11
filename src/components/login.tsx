import { useLoginHook } from '@/hooks/authHook'
import { loginUserHelper } from '@/lib/authHelper'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { FaEnvelope, FaLock, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa'

export function LoginPage() {
  const [loginStatus, setLoginStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // AUTH LOGIN HOOK
  const { mutate, data } = useLoginHook()
  const navigate = useNavigate()

  // Manual validation functions
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email is required'
    if (!re.test(email)) return 'Please enter a valid email'
    return null
  }

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return null
  }
  useEffect(() => {
    if (data) {
      loginUserHelper(data.token, data.user)
      navigate({ to: '/dashboard', replace: true })
    }

    console.log('data in useEffect', data)
  }, [data])

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        // API call
        mutate(value)
        console.log('myresponse', data)

        setLoginStatus({
          success: true,
          message: 'Login successful! Redirecting...',
        })
      } catch (error) {
        console.error('Login failed:', error)
        setLoginStatus({
          success: false,
          message: 'Invalid email or password',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Welcome Back!</h1>
        <p className="text-lg text-gray-600">
          We're so excited to see you again!
        </p>
      </div>

      {/* Login Form Container */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {/* Status Message */}
        {loginStatus && (
          <div
            className={`mb-6 p-4 rounded-md flex items-center ${
              loginStatus.success
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {loginStatus.success ? (
              <FaCheck className="mr-2 text-green-500" />
            ) : (
              <FaTimes className="mr-2 text-red-500" />
            )}
            <span>{loginStatus.message}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          {/* Email Field */}
          <form.Field
            name="email"
            children={(field) => {
              const error = validateEmail(field.state.value)
              return (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope
                        className={`h-5 w-5 ${
                          field.state.value
                            ? error
                              ? 'text-red-400'
                              : 'text-green-400'
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        // Clear status when user starts typing again
                        setLoginStatus(null)
                      }}
                      onKeyDown={() => setLoginStatus(null)}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        field.state.value
                          ? error
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-md shadow-sm focus:outline-none`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {field.state.value && error && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FaTimes className="mr-1" /> {error}
                    </p>
                  )}
                  {field.state.value && !error && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <FaCheck className="mr-1" /> Email looks good!
                    </p>
                  )}
                </div>
              )
            }}
          />

          {/* Password Field */}
          <form.Field
            name="password"
            children={(field) => {
              const error = validatePassword(field.state.value)
              return (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock
                        className={`h-5 w-5 ${
                          field.state.value
                            ? error
                              ? 'text-red-400'
                              : 'text-green-400'
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        setLoginStatus(null)
                      }}
                      onKeyDown={() => setLoginStatus(null)}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        field.state.value
                          ? error
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-md shadow-sm focus:outline-none`}
                      placeholder="••••••"
                    />
                  </div>
                  {field.state.value && error && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FaTimes className="mr-1" /> {error}
                    </p>
                  )}
                  {field.state.value && !error && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <FaCheck className="mr-1" /> Password meets requirements
                    </p>
                  )}
                </div>
              )
            }}
          />

          {/* Submit Button */}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !canSubmit || isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            )}
          />
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </a>
        </div>
      </div>
    </div>
  )
}
