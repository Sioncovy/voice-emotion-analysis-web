<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  adviceList: {
    type: Object as PropType<Array<{ title: string; content: string }>>,
    required: true
  }
})
</script>

<template>
  <n-flex vertical size="medium">
    <n-card v-for="item in props.adviceList">
      <n-h3 prefix="bar" type="info">{{ item.title }}</n-h3>
      <n-p>{{ item.content }}</n-p>
    </n-card>
  </n-flex>
</template>

<style lang="less" scoped></style>
