<script setup lang="ts">
import { useStore } from '@/store'
import dayjs from 'dayjs'
import PieChart from './PieChart.vue'
import BarChart from './BarChart.vue'
import LineChart from './LineChart.vue'
import localforage from '@/utils/localforage'
import { RecordType } from '@/types'
import { ref } from 'vue'

const store = useStore()
console.log('✨  ~ store:', store)

const todayDataObj = ref<Record<string, number>>({})
const todayData = ref<any[]>([])

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
        item.title.split(' ')[0] === today && item.result !== 'null'
    )
    .reduce((acc: any, cur: any) => {
      const key = cur.result
      acc[key] = acc[key] ? acc[key] + 1 : 1
      return acc
    }, {})
  todayData.value = Object.keys(todayDataObj.value).map((key) => ({
    value: todayDataObj.value[key],
    name: key
  }))

  const week = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
  weekDataObj.value = list
    .filter(
      (item: any) =>
        dayjs(item.title.split(' ')[0]).isAfter(week) && item.result !== 'null'
    )
    .map((item) => item.title.split(' ')[0])
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

console.log('✨  ~ todayData ~ todayData:', todayData.value)
</script>

<template>
  <div style="padding: 24px; height: calc(100% - 48px)">
    <n-grid :x-gap="12" :y-gap="8" :cols="2" style="height: 100%">
      <n-grid-item>
        <n-card style="height: 100%">
          <PieChart :data="todayData" />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card style="height: 100%">
          <BarChart :data="todayData" />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card style="height: 100%">
          <LineChart :data="weekData" />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card style="height: 100%">
          <div>这里是一些建议</div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style lang="less" scoped></style>
