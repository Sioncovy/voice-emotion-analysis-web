<script setup lang="ts">
import { Emotion, RecordType } from '@/types'
import localforage from '@/utils/localforage'
import { ArchiveOutline, CheckmarkOutline } from '@vicons/ionicons5'
import { FileInfo } from 'naive-ui/es/upload/src/interface'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { calcFileSize } from '../utils'

const route = useRoute()
const id = ref('')
const record = ref<RecordType | null>(null)

watch(
  () => route.params.id,
  async (newId) => {
    const rawData = (await localforage.getItem(newId as string)) as RecordType
    id.value = newId as string
    record.value = rawData
    audio.value = rawData.audio
    result.value = rawData.result as Emotion
  },
  {
    immediate: true
  }
)

const audio = ref<File | null>(null)
const audioUrl = computed(() => {
  if (audio.value === null) return ''
  return URL.createObjectURL(audio.value)
})

const result = ref<Emotion>(Emotion.NULL)
const resultLoading = ref(false)

const emotionImageMap: {
  [key in Emotion]: string
} = {
  [Emotion.NULL]: '',
  [Emotion.HAPPY]: 'https://img.icons8.com/color/48/000000/happy.png',
  [Emotion.SAD]: 'https://img.icons8.com/color/48/000000/sad.png',
  [Emotion.ANGER]: 'https://img.icons8.com/color/48/000000/angry.png',
  [Emotion.FEAR]: 'https://img.icons8.com/color/48/000000/fear.png',
  [Emotion.NEUTRAL]: 'https://img.icons8.com/color/48/000000/neutral.png'
}

const uploadFinished = async (fileInfo: Required<FileInfo>) => {
  audio.value = fileInfo.file
  const rawData = (await localforage.getItem(id.value)) as RecordType
  localforage.setItem(id.value, {
    ...rawData,
    audio: fileInfo.file
  })
  console.log('upload finished', audio.value)
}

const submit = async () => {
  resultLoading.value = true
  setTimeout(async () => {
    result.value = Emotion.HAPPY
    resultLoading.value = false
    const rawdata = (await localforage.getItem(id.value)) as RecordType
    localforage.setItem(id.value, {
      ...rawdata,
      result: Emotion.HAPPY
    })
  }, 2000)
}
</script>

<template>
  <n-split
    direction="horizontal"
    style="height: 100%; width: 100%"
    :max="0.75"
    :min="0.25"
  >
    <template #1>
      <n-flex vertical style="padding: 24px">
        <n-h3 prefix="bar" type="info">上传音频</n-h3>
        <n-upload
          accept=".mp3,.wav"
          :show-file-list="false"
          @before-upload="
            ({ file }) => {
              uploadFinished(file)
              return false
            }
          "
        >
          <n-upload-dragger>
            <!-- 没有上传文件的时候 -->
            <div v-if="audio === null">
              <div style="margin-bottom: 12px">
                <n-icon size="60" :depth="3">
                  <ArchiveOutline />
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                点击或者拖动文件到该区域来上传
              </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">
                目前支持的音频格式为： MP3，WAV
              </n-p>
            </div>
            <!-- 上传了文件的时候 -->
            <div v-else>
              <div style="margin-bottom: 12px">
                <n-icon size="60" color="green" :depth="3">
                  <CheckmarkOutline />
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                {{ audio.name }}
              </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">
                文件大小：{{ calcFileSize(audio.size) }}
              </n-p>
            </div>
          </n-upload-dragger>
        </n-upload>
        <audio v-if="audio" style="width: 100%" controls :src="audioUrl" />
        <n-button
          v-if="audio"
          type="info"
          ghost
          style="width: 100%"
          @click="submit"
        >
          开始解析
        </n-button>
      </n-flex>
    </template>
    <template #2>
      <div style="padding: 24px">
        <n-h3 prefix="bar" type="info">解析结果</n-h3>
        <n-flex vertical>
          <n-spin v-if="resultLoading" />
          <div v-if="result !== Emotion.NULL">
            <div>情绪：{{ result }}</div>
            <div>
              <img
                :src="emotionImageMap[result]"
                style="width: 100px; height: 100px"
              />
            </div>
          </div>
        </n-flex>
      </div>
    </template>
  </n-split>
</template>

<style lang="less" scoped></style>
