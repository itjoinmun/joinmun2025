/**
 * Functions to handle user authentication and data retrieval
 * @module auth/fetch_user
 */

/**
 * Retrieves the current user's data from request headers
 * @async
 * @returns {Promise<User>} User object if headers exist, null otherwise
 */

/**
 * Validates and fetches user profile data from authentication server
 * @async
 * @param {string} [accessToken] - Optional access token for authentication
 * @returns {Promise<any | null>} User profile data if request succeeds, null otherwise
 * @throws Will throw an error if the fetch request fails
 */
'use server'
import { cookies, headers } from 'next/headers'

export type User = {
    username: string 
    email: string 
    role: string 
    user_id: number | string
  } | null
  
export const getAccessToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value as string
}

export const getRefreshToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('refresh_token')?.value as string
}

export async function fetchUser(): Promise<User> {
  // First try to get user from headers
  const headersList = await headers()
  const username = headersList.get('x-user-username')
  const email = headersList.get('x-user-email')
  const role = headersList.get('x-user-role')
  const user_id = headersList.get('x-user-id')

  // If headers have the user data, return it
  if (username && email && role && user_id) {
    return { username, email, role, user_id }
  }

  // If headers don't have user data, try to fetch directly
  try {
    const accessToken = await getAccessToken()
    if (accessToken) {
      const userData = await fetchUserClient(accessToken)
      if (userData) {
        return {
          username: userData.username,
          email: userData.email,
          role: userData.role,
          user_id: userData.user_id,
        }
      }
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }

  // If all attempts fail, return null
  return null
}

export const fetchUserClient = async (accessToken?: string) => {
  const res = await fetch(`${process.env.API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `access_token=${accessToken}`,
    },
    credentials: 'include',
  })
  if (res.ok) {
    return await res.json()
  }

  return null
}
