import { User } from '@/types'
import { request } from '@/utils'

export const login = (data: {
  username: string
  password: string
}): Promise<{
  access_token: string
  userInfo: User
}> => request.post('/users/login', data)

export const register = (data: {
  username: string
  password: string
}): Promise<User> => request.post('/users/register', data)

export const profile = (): Promise<User> => request.get('/users/profile')
