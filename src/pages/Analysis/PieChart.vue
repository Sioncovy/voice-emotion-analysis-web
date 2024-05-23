<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide, watch } from 'vue'
import dayjs from 'dayjs'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

const today = dayjs().format('YYYY-MM-DD')

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const option = ref({
  title: {
    text: `${today} 情绪分析统计`,
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: props.data.map((item) => item.name)
  },
  series: [
    {
      name: '情绪',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: props.data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

watch(
  () => props.data,
  (newData) => {
    option.value = {
      ...option.value,
      legend: {
        orient: 'vertical',
        left: 'left',
        data: newData.map((item) => item.name)
      },
      series: [
        {
          ...option.value.series[0],
          data: newData
        }
      ]
    }
  }
)
</script>

<style lang="less" scoped>
.chart {
  height: 100%;
}
</style>
