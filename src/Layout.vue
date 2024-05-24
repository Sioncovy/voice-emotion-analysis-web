<script setup lang="ts">
import Tree from '@/pages/Tree/index.vue'
import { CreateType, RecordType } from '@/types'
import localforage from '@/utils/localforage'
import { Add, FolderOutline, Mic, SearchOutline } from '@vicons/ionicons5'
import { DropdownProps } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { profile } from './apis'
import { AUTH_TOKEN_KEY } from './config'
import { useStore } from './store'
import { createNewRecord, renderIcon } from './utils'

const router = useRouter()
const store = useStore()

const search = ref('')

if (!store.userInfo) {
  profile()
    .then((res) => {
      store.userInfo = res
    })
    .catch(() => {
      store.userInfo = null
      localStorage.removeItem(AUTH_TOKEN_KEY)
      router.push('/login')
    })
}

async function getLocalRecord() {
  const keys = await localforage.keys()
  const list = (await Promise.all(
    keys.map((key) => localforage.getItem(key))
  )) as RecordType[]

  store.records = list
}

// 读取本地记录数据
getLocalRecord()

const createOptions: DropdownProps['options'] = [
  {
    label: '新建情绪分析',
    key: CreateType.NewRecord,
    icon: renderIcon(Mic)
  },
  {
    label: '新建文件夹',
    key: CreateType.NewFolder,
    icon: renderIcon(FolderOutline)
  }
]

const handleCreateSelect = async (value: CreateType) => {
  switch (value) {
    case CreateType.NewRecord: {
      const record = createNewRecord(CreateType.NewRecord)
      router.push({ name: 'NewUpload', params: { id: record.id } })
      await localforage.setItem(record.id, record)
      break
    }
    case CreateType.NewFolder: {
      const folder = createNewRecord(CreateType.NewFolder)
      await localforage.setItem(folder.id, folder)
      break
    }
  }
  await getLocalRecord()
}
</script>

<template>
  <n-layout :style="{ height: '100%' }">
    <n-layout has-sider :style="{ height: 'calc(100% - 64px)' }">
      <n-layout-sider
        collapse-mode="transform"
        :collapsed-width="0"
        :width="360"
        show-trigger="bar"
        bordered
        content-style="padding: 24px;"
        :native-scrollbar="false"
      >
        <n-flex vertical>
          <n-flex justify="space-between">
            <n-input
              size="small"
              style="flex: 1; font-size: 12px"
              placeholder="搜索"
              v-model:value="search"
            >
              <template #suffix>
                <n-button text>
                  <n-icon :component="SearchOutline" />
                </n-button>
              </template>
            </n-input>
            <n-dropdown
              trigger="click"
              :options="createOptions"
              @select="handleCreateSelect"
            >
              <n-button type="info" size="small">
                <n-icon :component="Add" />
              </n-button>
            </n-dropdown>
          </n-flex>
          <n-button
            type="primary"
            ghost
            size="small"
            @click="
              () => {
                router.push({ name: 'Analysis' })
              }
            "
          >
            分析统计
          </n-button>
          <Tree
            :raw-data="
              store.records.filter((item) => item.title.includes(search))
            "
            @getLocalRecord="getLocalRecord"
          />
        </n-flex>
      </n-layout-sider>
      <n-layout-content>
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped></style>
