<script setup lang="ts">
import { Advice } from '@/types'
import { PropType } from 'vue'

const props = defineProps({
  advice: {
    type: Object as PropType<Advice>,
    required: true
  }
})

console.log(props.advice)
</script>

<template>
  <n-thing class="container">
    <n-h2 prefix="bar">{{ props.advice.title }}</n-h2>
    <n-flex vertical :size="24">
      <n-card class="content">
        <n-p>{{ props.advice.content }}</n-p>
      </n-card>
      <n-flex v-if="props.advice.reply">
        <n-h4 prefix="bar" type="info">回复：</n-h4>
        <n-card class="reply">{{ props.advice.reply }}</n-card>
      </n-flex>
      <n-flex v-else justify="center" align="center" class="reply">
        <n-h4>暂无回复</n-h4>
      </n-flex>
    </n-flex>
  </n-thing>
</template>

<style lang="less" scoped>
.container {
  height: 800px;

  .content {
    height: 400px;
  }

  .reply {
    height: 200px;
  }
}
</style>
