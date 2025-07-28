import { API_BASE_URL } from '../api/BaseUrl'

export const loginFn = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  // if (!response.ok) {
  //     throw new Error('Login failed');
  // }

  const data = await response.json()
  return data
}

export const registerFn = async (userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: string
}) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Registration failed')
  }

  const data = await response.json()
  return data
}

export const forgotPasswordFn = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to send reset email')
  }

  const data = await response.json()
  return data
}

export const resetPasswordFn = async (payload: { email: string; otp: string; newPassword: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to reset password')
  }

  const data = await response.json()
  return data
}
