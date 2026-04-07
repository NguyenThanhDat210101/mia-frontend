import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Gửi cookie tự động
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

// Request Interceptor: Attach Token từ memory
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Silent Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Tự động gọi refresh (cookie refresh_token sẽ được trình duyệt tự gửi kèm)
        const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true })
        
        const { access_token } = response.data.data
        
        setAccessToken(access_token)
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        
        return apiClient(originalRequest)
      } catch (refreshError) {
        setAccessToken(null)
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
