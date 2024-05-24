<script setup lang="ts">
import { Share } from '@/types'
import { PropType } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  share: {
    type: Object as PropType<Share>,
    required: true
  }
})

console.log(props.share)
</script>

<template>
  <n-thing class="detail">
    <n-h2 prefix="bar">{{ props.share.title }}</n-h2>
    <n-flex justify="space-between">
      <n-flex class="info" align="center">
        <n-avatar round size="small" :src="share.user.avatar" />
        <n-text>{{ share.user.username || '--' }}</n-text>
      </n-flex>
      <n-text :depth="3"
        >创建时间：{{
          dayjs(share.createdAt).format('YYYY-MM-DD HH:mm:ss')
        }}</n-text
      >
    </n-flex>
    <n-flex vertical :size="24">
      <n-card class="content">
        <n-p>{{ props.share.content }}</n-p>
      </n-card>
    </n-flex>
  </n-thing>
</template>

<style lang="less" scoped>
.detail {
  height: 800px;

  .info {
    margin-bottom: 12px;
  }

  .content {
    height: 600px;
  }
}
</style>
