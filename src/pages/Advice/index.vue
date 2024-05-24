<script setup lang="ts">
import { Advice } from '@/types'
import { reactive, ref } from 'vue'
import dayjs from 'dayjs'
import Detail from './Detail.vue'
import { FormInst } from 'naive-ui'
import { createAdvice, getAdviceList } from '@/apis'

const list = ref<Advice[]>([
  {
    _id: '1',
    title: '如何使用 Vue3',
    content:
      '请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？请问如何使用 Vue3？',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    _id: '2',
    title: '如何使用 Vite',
    content: '请问如何使用 Vite？',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    _id: '3',
    title: '如何使用 VitePress',
    content: '请问如何使用 VitePress？',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    _id: '4',
    title: '如何使用 VitePress',
    content: '请问如何使用 VitePress？',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    _id: '5',
    title: '如何使用 VitePress',
    content: '请问如何使用 VitePress？',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    _id: '6',
    title: '如何使用 VitePress',
    content: '请问如何使用 VitePress？',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    _id: '7',
    title: '如何使用 VitePress',
    content: '请问如何使用 VitePress？',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    _id: '8',
    title: '如何使用 VitePress',
    content: '请问如何使用 VitePress？',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    _id: '9',
    title: '如何使用 VitePress',
    content: '请问如何使用 VitePress？',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    _id: '10',
    title: '如何使用 VitePress',
    content: '请问如何使用 VitePress？',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    _id: '11',
    title: '如何使用 VitePress',
    content: '请问如何使用 VitePress？',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  {
    _id: '12',
    title: '如何使用 VitePress',
    content: '请问如何使用 VitePress？',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
])

getAdviceList().then((res) => {
  console.log('✨  ~ getAdviceList ~ res:', res)
  list.value = res
})

const detailOpen = ref(false)
const addOpen = ref(false)
const advice = ref<Advice | null>(null)

const addFormValue = reactive({
  title: '',
  content: ''
})
const formRef = ref<FormInst | null>(null)

const contentHandle = (content: string) => {
  const length = content.length
  if (length > 30) {
    return content.slice(0, 30) + '...'
  } else {
    return content
  }
}

const click = (item: Advice) => {
  advice.value = item
  detailOpen.value = true
}

const addAdvice = () => {
  formRef.value?.validate().then((valid) => {
    if (valid) {
      console.log('验证成功')
      console.log(addFormValue)
      createAdvice(addFormValue).then((res) => {
        console.log('✨  ~ createAdvice ~ res:', res)
        addOpen.value = false
        getAdviceList().then((res) => {
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
  <n-thing class="container">
    <!-- <n-h2 prefix="bar">问题列表</n-h2> -->
    <n-flex vertical size="medium">
      <n-list clickable hoverable bordered class="list">
        <n-list-item
          v-for="item in list"
          class="list-item"
          @click="() => click(item)"
        >
          <n-thing>
            <n-h3>{{ item.title }}</n-h3>
            <n-p>{{ contentHandle(item.content) }}</n-p>
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
          </n-thing>
        </n-list-item>
      </n-list>
      <n-button
        type="info"
        ghost
        @click="
          () => {
            addOpen = true
          }
        "
        >新增问题</n-button
      >
    </n-flex>
  </n-thing>
  <n-modal
    :show="detailOpen && Boolean(advice)"
    preset="card"
    style="width: 600px"
    title="问题详情"
    @close="
      () => {
        detailOpen = false
        advice = null
      }
    "
  >
    <Detail :advice="advice!" />
  </n-modal>
  <n-modal
    title="新建问题"
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
        <n-button block ghost type="primary" @click="addAdvice">
          验证
        </n-button>
      </n-form>
    </n-thing>
  </n-modal>
</template>

<style lang="less" scoped>
.container {
  // width: 600px;

  .list {
    height: 800px;
    overflow: auto;
  }

  .bottom {
    font-size: 12px;
    color: #999;
  }
}

.form {
  height: 800px;
}
</style>
