import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  FaCheck,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaSpinner,
  FaTimes,
  FaUser,
} from 'react-icons/fa'
import type { CreateUserDto } from '@/types/alltypes'
import { Role } from '@/types/alltypes'
import { registerFn } from '@/api/auth'

export function Register() {
  const [registerStatus, setRegisterStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const validateFirstName = (firstName: string) => {
    if (!firstName) return 'First name is required'
    if (firstName.length < 2) return 'First name must be at least 2 characters'
    return null
  }

  const validateLastName = (lastName: string) => {
    if (!lastName) return 'Last name is required'
    if (lastName.length < 2) return 'Last name must be at least 2 characters'
    return null
  }

  const validatePhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return null // Optional field
    const re = /^[\+]?[1-9][\d]{0,15}$/
    if (!re.test(phoneNumber.replace(/\s/g, '')))
      return 'Please enter a valid phone number'
    return null
  }

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: Role.patient,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      setRegisterStatus(null)

      try {
        const registrationData = {
          email: value.email,
          password: value.password,
          firstName: value.firstName,
          lastName: value.lastName,
          phoneNumber: value.phoneNumber || '',
          role: value.role,
        }

        console.log('Attempting registration with data:', registrationData)
        console.log(
          'API URL:',
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/register`,
        )

        const response = await registerFn(registrationData)

        console.log('Registration successful:', response)

        setRegisterStatus({
          success: true,
          message: 'Registration successful! Redirecting to login...',
        })

        // Redirect to login after successful registration
        setTimeout(() => {
          navigate({ to: '/login' })
        }, 2000)
      } catch (error: any) {
        console.error('Registration failed:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          response: error.response,
        })

        const errorMessage =
          error.message || 'Registration failed. Please try again.'
        setRegisterStatus({
          success: false,
          message: errorMessage,
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
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          Create Account
        </h1>
        <p className="text-lg text-gray-600">Join HealthCore Connect today!</p>
      </div>

      {/* Registration Form Container */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {/* Status Message */}
        {registerStatus && (
          <div
            className={`mb-6 p-4 rounded-md flex items-center ${
              registerStatus.success
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {registerStatus.success ? (
              <FaCheck className="mr-2 text-green-500" />
            ) : (
              <FaTimes className="mr-2 text-red-500" />
            )}
            <span>{registerStatus.message}</span>
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
          {/* First Name Field */}
          <form.Field
            name="firstName"
            children={(field) => {
              const error = validateFirstName(field.state.value)
              return (
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser
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
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        setRegisterStatus(null)
                      }}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        field.state.value
                          ? error
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-md shadow-sm focus:outline-none`}
                      placeholder="John"
                    />
                  </div>
                  {field.state.value && error && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FaTimes className="mr-1" /> {error}
                    </p>
                  )}
                  {field.state.value && !error && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <FaCheck className="mr-1" /> First name looks good!
                    </p>
                  )}
                </div>
              )
            }}
          />

          {/* Last Name Field */}
          <form.Field
            name="lastName"
            children={(field) => {
              const error = validateLastName(field.state.value)
              return (
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser
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
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        setRegisterStatus(null)
                      }}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        field.state.value
                          ? error
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-md shadow-sm focus:outline-none`}
                      placeholder="Doe"
                    />
                  </div>
                  {field.state.value && error && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FaTimes className="mr-1" /> {error}
                    </p>
                  )}
                  {field.state.value && !error && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <FaCheck className="mr-1" /> correct
                    </p>
                  )}
                </div>
              )
            }}
          />

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
                        setRegisterStatus(null)
                      }}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        field.state.value
                          ? error
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-md shadow-sm focus:outline-none`}
                      placeholder="timo@email.com"
                    />
                  </div>
                  {field.state.value && error && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FaTimes className="mr-1" /> {error}
                    </p>
                  )}
                  {field.state.value && !error && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <FaCheck className="mr-1" /> correct!
                    </p>
                  )}
                </div>
              )
            }}
          />

          {/* Phone Number Field */}
          <form.Field
            name="phoneNumber"
            children={(field) => {
              const error = validatePhoneNumber(field.state.value)
              return (
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone
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
                      id="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        setRegisterStatus(null)
                      }}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        field.state.value
                          ? error
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-md shadow-sm focus:outline-none`}
                      placeholder="+1234567890"
                    />
                  </div>
                  {field.state.value && error && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FaTimes className="mr-1" /> {error}
                    </p>
                  )}
                  {field.state.value && !error && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <FaCheck className="mr-1" /> correct!
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
                      autoComplete="new-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        setRegisterStatus(null)
                      }}
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

          {/* Role Selection */}
          <form.Field
            name="role"
            children={(field) => (
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Account Type
                </label>
                <select
                  id="role"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value as Role)
                    setRegisterStatus(null)
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={Role.patient}>Patient</option>
                  {/* <option value={Role.doctor}>Doctor</option>
                  <option value={Role.pharmacist}>Pharmacist</option> */}
                </select>
              </div>
            )}
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
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            )}
          />
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  )
}

export default Register
