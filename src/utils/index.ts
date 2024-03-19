import { NIcon } from 'naive-ui'
import { Component, h } from 'vue'
import dayjs from 'dayjs'
import { CreateType, Emotion, RecordType } from '@/types'
import _ from 'lodash'

export function calcFileSize(size: number) {
  const kb = 1024
  const mb = kb * 1024
  const gb = mb * 1024
  if (size < kb) {
    return size + ' Bytes'
  } else if (size < mb) {
    return (size / kb).toFixed(2) + ' KB'
  } else if (size < gb) {
    return (size / mb).toFixed(2) + ' MB'
  } else {
    return (size / gb).toFixed(2) + ' GB'
  }
}
// render
export function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

export function createNewRecord(type: CreateType): RecordType {
  const now = dayjs()
  const time = now.format('YYYY-MM-DD HH:mm:ss')
  return {
    id: now.valueOf().toString(),
    title: time.valueOf(),
    createdAt: now.valueOf(),
    audio: null,
    result: Emotion.NULL,
    parentId: null,
    isFolder: type === CreateType.NewFolder
  }
}
