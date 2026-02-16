import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { serverAuthAPI } from '@/lib/api/server'
import type { UserResponse } from '@/lib/api/types'

/**
 * Check if user is authenticated by checking for auth cookie
 * This is a lightweight check that doesn't make an API call
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth_token')
  return !!authToken
}

/**
 * Get the current user from the server
 * Returns null if not authenticated or if there's an error
 */
export async function getCurrentUser(): Promise<UserResponse | null> {
  try {
    const user = await serverAuthAPI.getMe()
    return user
  } catch (error) {
    return null
  }
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use this in server components that require auth
 */
export async function requireAuth(): Promise<UserResponse> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}
