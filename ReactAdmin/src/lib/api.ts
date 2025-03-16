import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { AxiosHeaders } from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5086/api/', //backend base URL
})

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      // Create a new AxiosHeaders instance with the current headers and add the Authorization header.
      config.headers = new AxiosHeaders({
        ...config.headers,
        Authorization: `Bearer ${token}`,
      })
    }
    return config
  })
  
export default api
