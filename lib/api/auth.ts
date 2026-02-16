import apiClient from './client'
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from './types'

export const authAPI = {
  /**
   * Register a new user
   * Backend sets HTTP-only cookie automatically
   */
  async register(data: RegisterRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/register', data)
    return response.data
  },

  /**
   * Login with email and password
   * Backend sets HTTP-only cookie automatically
   */
  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/login', data)
    return response.data
  },

  /**
   * Get current user profile
   */
  async getMe(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>('/auth/me')
    return response.data
  },

  /**
   * Logout (clear server-side session and cookie)
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
  },
}