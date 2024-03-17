<script setup lang="ts">
import { ArchiveOutline, CheckmarkOutline } from '@vicons/ionicons5'
import { FileInfo } from 'naive-ui/es/upload/src/interface'
import { ref, computed } from 'vue'
import { calcFileSize } from '../utils'

const audio = ref<File | null>(null)
const audioUrl = computed(() => {
  if (audio.value === null) return ''
  return URL.createObjectURL(audio.value)
})

const result = ref<null | 'happy' | 'sad' | 'angry' | 'fear' | 'neutral'>(null)
const resultLoading = ref(false)

const emotionImageMap = {
  happy: 'https://img.icons8.com/color/48/000000/happy.png',
  sad: 'https://img.icons8.com/color/48/000000/sad.png',
  angry: 'https://img.icons8.com/color/48/000000/angry.png',
  fear: 'https://img.icons8.com/color/48/000000/fear.png',
  neutral: 'https://img.icons8.com/color/48/000000/neutral.png'
}

const uploadFinished = (fileInfo: Required<FileInfo>) => {
  audio.value = fileInfo.file
  console.log('upload finished', audio.value?.size)
}

const submit = () => {
  resultLoading.value = true
  setTimeout(() => {
    result.value = 'happy'
    resultLoading.value = false
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
          action="http://127.0.0.1:4523/m1/3434069-0-default/common/upload"
          directory-dnd
          :show-file-list="false"
          :on-finish="({ file }) => uploadFinished(file)"
        >
          <n-upload-dragger>
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
          <div v-if="result !== null">
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
