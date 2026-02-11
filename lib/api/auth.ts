import apiClient, { setAuthToken, clearAuthToken } from './client'
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from './types'

export const authAPI = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/register', data)
    
    // Store token in localStorage
    setAuthToken(response.data.access_token)
    
    return response.data
  },

  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/login', data)
    
    // Store token in localStorage
    setAuthToken(response.data.access_token)
    
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
   * Logout (clear local token)
   */
  logout(): void {
    clearAuthToken()
  },
}