<script setup lang="ts">
import { Share } from '@/types'
import { reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { FormInst } from 'naive-ui'
import { createShare, getShareList } from '@/apis'
import Detail from './ShareDetail.vue'
import { AddOutline } from '@vicons/ionicons5'

const list = ref<Share[]>([])
const detailOpen = ref(false)
const addOpen = ref(false)
const share = ref<Share | null>(null)
const formRef = ref<FormInst | null>(null)

getShareList().then((res) => {
  console.log('✨  ~ getShareList ~ res:', res)
  list.value = res
})

const contentHandle = (content: string) => {
  const length = content.length
  if (length > 100) {
    return content.slice(0, 100) + '...'
  } else {
    return content
  }
}

const click = (item: Share) => {
  share.value = item
  detailOpen.value = true
}

const addFormValue = reactive({
  title: '',
  content: ''
})

const addShare = () => {
  formRef.value?.validate().then((valid) => {
    if (valid) {
      console.log('验证成功')
      console.log(addFormValue)
      createShare(addFormValue).then((res) => {
        console.log('✨  ~ createAdvice ~ res:', res)
        addOpen.value = false
        getShareList().then((res) => {
          console.log('✨  ~ getAdviceList ~ res:', res)
          list.value = res
        })
      })
    } else {
      console.log('验证失败')
      console.log(addFormValue)
    }
  })
}
</script>

<template>
  <div class="container">
    <n-grid x-gap="12" y-gap="12" :cols="4">
      <n-gi v-for="item in list" @click="() => click(item)">
        <n-card hoverable class="item">
          <n-h3>{{ item.title }}</n-h3>
          <n-p class="content">{{ contentHandle(item.content) }}</n-p>
          <n-flex class="bottom">
            <n-text :depth="3"
              >创建时间：{{
                dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
              }}</n-text
            >
            <n-text :depth="3"
              >更新时间：{{
                dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
              }}</n-text
            >
          </n-flex>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
  <n-float-button
    type="primary"
    ghost
    :right="40"
    :bottom="90"
    @click="
      () => {
        addOpen = true
      }
    "
  >
    <n-icon>
      <AddOutline />
    </n-icon>
  </n-float-button>
  <n-modal
    title="新建分享"
    :show="addOpen"
    preset="card"
    style="width: 600px"
    @close="
      () => {
        addOpen = false
      }
    "
  >
    <n-thing>
      <n-form
        ref="formRef"
        class="form"
        :rules="{
          title: {
            required: true,
            trigger: ['blur', 'input'],
            message: '标题不能为空'
          },
          content: {
            required: true,
            trigger: ['blur', 'input'],
            message: '内容不能为空'
          }
        }"
        :model="addFormValue"
      >
        <n-form-item label="标题" path="title">
          <n-input
            v-model:value="addFormValue.title"
            placeholder="请输入标题"
          />
        </n-form-item>
        <n-form-item label="内容" path="content">
          <n-input
            v-model:value="addFormValue.content"
            placeholder="请输入内容"
            type="textarea"
            :autosize="{
              minRows: 5,
              maxRows: 10
            }"
          />
        </n-form-item>
        <n-button block ghost type="primary" @click="addShare"> 发布 </n-button>
      </n-form>
    </n-thing>
  </n-modal>
  <n-modal
    :show="detailOpen && Boolean(share)"
    preset="card"
    style="width: 600px"
    title="分享详情"
    @close="
      () => {
        detailOpen = false
        share = null
      }
    "
  >
    <Detail :share="share!" />
  </n-modal>
</template>

<style lang="less" scoped>
.container {
  padding: 24px;

  .item {
    height: 200px;
    display: flex;
    flex-direction: column;
    cursor: pointer;

    .content {
      height: 70px;
      overflow: auto;
    }
  }
}

.bottom {
  font-size: 12px;
  color: #999;
}
</style>
