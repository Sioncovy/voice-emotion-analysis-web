import { RecordType, User } from '@/types'
import { defineStore } from 'pinia'

export const useStore = defineStore('app', () => {
  const userInfo = null as null | User
  const records = [] as RecordType[]

  return {
    userInfo,
    records
  }
})
