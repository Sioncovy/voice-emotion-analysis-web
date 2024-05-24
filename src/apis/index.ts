import { User } from '@/types'
import { pyRequest, request } from '@/utils'

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

export const analysis = (file: File): Promise<any> =>
  pyRequest({
    url: '/predict',
    method: 'POST',
    data: {
      file
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

export const getAdviceList = (): Promise<any[]> => request.get('/advices')

export const createAdvice = (data: {
  title: string
  content: string
}): Promise<any> => request.post('/advices', data)
