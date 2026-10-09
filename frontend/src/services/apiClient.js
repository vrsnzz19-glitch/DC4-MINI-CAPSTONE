import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  timeout: 15000,
})

export const AUTH_TOKEN_KEY = 'tonevault_token'

apiClient.interceptors.request.use((config) => {
  const isPublicAuthRequest = /\/(login|register)\/?$/.test(config.url || '')
  const token = isPublicAuthRequest ? null : localStorage.getItem(AUTH_TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      window.dispatchEvent(new Event('tonevault:unauthorized'))
    }

    return Promise.reject(error)
  },
)

export default apiClient
