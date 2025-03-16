import api from '../lib/api'

interface LoginResponse {
  token: string
  user: {
    name: string
    email: string
    role: string[]
    exp: number
  }
}

export async function loginUser(credentials: { email: string; password: string }): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('users/login', credentials)
  return response.data
}
