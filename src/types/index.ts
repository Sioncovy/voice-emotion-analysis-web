export enum CreateType {
  NewRecord = 'new-record',
  NewFolder = 'new-folder'
}

export enum Emotion {
  NULL = 'null',
  ANGER = 'anger',
  FEAR = 'fear',
  HAPPY = 'happy',
  NEUTRAL = 'neutral',
  SAD = 'sad'
}

export type AnalysisResult = string

export type RecordType = {
  id: string
  title: string
  createdAt: number
  audio: File | null
  result: AnalysisResult
  parentId: string | null
  isFolder: boolean
}

export enum Role {
  Admin = 'admin',
  User = 'user'
}

export interface User {
  _id: string
  username: string
  nickname?: string
  avatar: string
  role: Role
  createdAt: string
  updatedAt: string
}
