import { API_BASE_URL } from './BaseUrl'

import type { TUser } from '@/types/alltypes'
import { getAccessTokenHelper } from '@/lib/auth'

// Get all users without pagination (backend doesn't support pagination params)
export const getAllUsersFn = async (): Promise<Array<TUser>> => {
  const fullUrl = `${API_BASE_URL}/users`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  const data = await response.json()
  return data.data || data // Handle both response formats
}

export const getUserFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: Array<TUser>
  total: number
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  })

  const fullUrl = `${API_BASE_URL}/users?${params.toString()}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

export const deleteUserFn = async (userId: number) => {
  const fullUrl = `${API_BASE_URL}/users/${userId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete user')
  }

  return response.json()
}

export const createUserFn = async (userData: {
  name: string
  email: string
  role: string
  phone?: string // Optional field, adjust as necessary
}) => {
  const fullUrl = `${API_BASE_URL}/users`
  console.log('userData', userData)
  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(userData),
  })

  // if (!response.ok) {
  //   throw new Error('Failed to create user');
  // }
  const data = await response.json()
  console.log('Created user:', data)
  return data
}

export const updateUserFn = async (
  userId: number,
  userData: Partial<TUser>,
): Promise<TUser> => {
  const fullUrl = `${API_BASE_URL}/users/${userId}`

  const response = await fetch(fullUrl, {
    method: 'PATCH', // Changed from PUT to PATCH
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error('Failed to update user')
  }

  return response.json()
}

// Get current user profile with role-specific data
export const getCurrentUserProfileFn = async () => {
  const fullUrl = `${API_BASE_URL}/users/profile`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user profile')
  }

  return response.json()
}
