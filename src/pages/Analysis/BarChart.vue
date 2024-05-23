<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide, watch } from 'vue'
import dayjs from 'dayjs'

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
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
    trigger: 'item'
  },
  xAxis: {
    type: 'category',
    data: props.data.map((item) => item.name)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '情绪',
      type: 'bar',
      data: props.data.map((item) => item.value)
    }
  ]
})

watch(
  () => props.data,
  (newData) => {
    option.value = {
      ...option.value,
      xAxis: {
        type: 'category',
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
