export enum CreateType {
  NewRecord = 'new-record',
  NewFolder = 'new-folder'
}

export enum Emotion {
  NULL = 'null',
  '中性' = '中性',
  '平静' = '平静',
  '快乐' = '快乐',
  '悲伤' = '悲伤',
  '愤怒' = '愤怒',
  '恐惧' = '恐惧',
  '厌恶' = '厌恶',
  '惊讶' = '惊讶'
}

enum AudioRecordStatus {
  Record = 'record',
  Pause = 'pause',
  Stop = 'stop',
  Init = 'init'
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

export enum Mode {
  File = 'file',
  Record = 'record'
}

export enum RecordStatus {
  Record = 'record',
  Pause = 'pause',
  Stop = 'stop',
  Init = 'init'
}
