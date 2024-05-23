<script setup lang="ts">
import { Emotion, RecordType } from '@/types'
import localforage from '@/utils/localforage'
import { ArchiveOutline, CheckmarkOutline } from '@vicons/ionicons5'
import { FileInfo } from 'naive-ui/es/upload/src/interface'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { calcFileSize } from '../utils'
import { analysis } from '@/apis'
import { useStore } from '@/store'

const store = useStore()

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
  [Emotion.快乐]: '/emotion/happy.png',
  [Emotion.悲伤]: '/emotion/sad.png',
  [Emotion.愤怒]: '/emotion/angry.png',
  [Emotion.恐惧]: '/emotion/fear.png',
  [Emotion.惊讶]: '/emotion/surprise.png',
  [Emotion.厌恶]: '/emotion/disgust.png',
  [Emotion.中性]: '/emotion/neutral.png',
  [Emotion.平静]: '/emotion/peace.png'
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
  if (audio.value === null) return
  const { data } = await analysis(audio.value)
  result.value = data?.emotion
  resultLoading.value = false
  const rawdata = (await localforage.getItem(id.value)) as RecordType
  localforage.setItem(id.value, {
    ...rawdata,
    result: data?.emotion
  })
  store.records = store.records.map((item) => {
    if (item.id === id.value) {
      return {
        ...item,
        result: data?.emotion
      }
    }
    return item
  })
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
          <n-flex justify="center" v-if="result !== Emotion.NULL">
            <img :src="emotionImageMap[result]" style="width: 100%" />
            <div class="result">情绪：{{ result }}</div>
          </n-flex>
        </n-flex>
      </div>
    </template>
  </n-split>
</template>

<style lang="less" scoped>
.result {
  font-size: 24px;
  padding: 12px;
  border-bottom: 2px solid #f0f0f0;
}
</style>
