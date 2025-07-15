// API/users.ts
import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";
import type { TUser } from "@/Types/types";

export const getUserFn = async (page = 1, limit = 10, search = ''): Promise<{
  data: TUser[];
  total: number;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search
  });

  const fullUrl = `${url}/users?${params.toString()}`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export const deleteUserFn = async (userId: number): Promise<void> => {
  const fullUrl = `${url}/users/${userId}`;

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
}

export const createUserFn = async (userData : {
  name: string;
  email: string;
  role: string;
  phone?: string; // Optional field, adjust as necessary
}) => {
  const fullUrl = `${url}/users`;
console.log("userData", userData);
  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(userData),
  });

  // if (!response.ok) {
  //   throw new Error('Failed to create user');
  // }
  const data = await response.json();
  console.log("Created user:", data);
  return data;
}

export const updateUserFn = async (userId: number, userData: Partial<TUser>): Promise<TUser> => {
  const fullUrl = `${url}/users/${userId}`;

  const response = await fetch(fullUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
} 