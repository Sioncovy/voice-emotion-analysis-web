import axios from 'axios'
import { AUTH_TOKEN_KEY, REQUEST_URL, PY_REQUEST_API } from '@/config'

const request = axios.create({
  baseURL: REQUEST_URL
})

const pyRequest = axios.create({
  baseURL: PY_REQUEST_API
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (config) => {
    if (config.data.code === 200) return config.data.data
    else throw new Error(config.data.code)
  },
  (error) => {
    return Promise.reject(error)
  }
)

export { request, pyRequest }
