<script setup lang="ts">
import { useStore } from '@/store'
import { Emotion, RecordType } from '@/types'
import localforage from '@/utils/localforage'
import dayjs from 'dayjs'
import { ref } from 'vue'
import BarChart from './BarChart.vue'
import EmotionAdvice from './EmotionAdvice.vue'
import LineChart from './LineChart.vue'
import PieChart from './PieChart.vue'
import { analysisAdviceConfig } from './config'

const store = useStore()

const todayDataObj = ref<Record<string, number>>({})
const todayData = ref<any[]>([])
const emotion = ref<{
  emotion: Emotion
  count: number
}>()

const weekDataObj = ref<Record<string, number>>({})

const weekData = ref<any[]>([])

async function getLocalRecord() {
  const today = dayjs().format('YYYY-MM-DD')
  const keys = await localforage.keys()
  const list = (await Promise.all(
    keys.map((key) => localforage.getItem(key))
  )) as RecordType[]

  store.records = list

  todayDataObj.value = list
    .filter(
      (item: any) =>
        dayjs(item.createdAt).format('YYYY-MM-DD') === today &&
        item.result !== 'null'
    )
    .reduce((acc: any, cur: any) => {
      const key = cur.result
      acc[key] = acc[key] ? acc[key] + 1 : 1
      return acc
    }, {})
  todayData.value = Object.keys(todayDataObj.value).map((key) => {
    if (!emotion.value) {
      emotion.value = {
        emotion: key as Emotion,
        count: todayDataObj.value[key]
      }
    } else if (todayDataObj.value[key] > emotion.value.count) {
      emotion.value = {
        emotion: key as Emotion,
        count: todayDataObj.value[key]
      }
    }
    return {
      value: todayDataObj.value[key],
      name: key
    }
  })

  const week = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
  weekDataObj.value = list
    .filter(
      (item: any) =>
        dayjs(item.createdAt).isAfter(week) && item.result !== 'null'
    )
    .map((item) => dayjs(item.createdAt).format('YYYY-MM-DD'))
    .reduce((acc: any, cur: any) => {
      const key = cur
      acc[key] = acc[key] ? acc[key] + 1 : 1
      return acc
    }, {})

  weekData.value = Object.keys(weekDataObj.value).map((key) => ({
    value: weekDataObj.value[key],
    name: key
  }))
}

// 读取本地记录数据
getLocalRecord()
</script>

<template>
  <div style="padding: 24px; height: calc(100vh - 48px - 64px)">
    <n-grid :x-gap="12" :y-gap="8" :cols="2" style="height: 100%">
      <n-grid-item>
        <n-card style="height: calc((100vh - 64px - 48px - 12px) / 2)">
          <PieChart :data="todayData" />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card style="height: calc((100vh - 64px - 48px - 12px) / 2)">
          <BarChart :data="todayData" />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card style="height: calc((100vh - 64px - 48px - 12px) / 2)">
          <LineChart :data="weekData" />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card style="height: calc((100vh - 64px - 48px - 12px) / 2)">
          <n-h2 prefix="bar">{{ emotion?.emotion }}情绪的调整建议</n-h2>
          <EmotionAdvice
            :advice-list="
              analysisAdviceConfig[emotion?.emotion || Emotion.NULL]
            "
          />
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style lang="less" scoped></style>
