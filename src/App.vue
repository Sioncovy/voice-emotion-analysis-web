<script setup lang="ts">
import Tree from '@/pages/Tree/index.vue'
import { CreateType, RecordType } from '@/types'
import localforage from '@/utils/localforage'
import {
  Add,
  FolderOutline,
  LanguageOutline,
  Mic,
  SearchOutline
} from '@vicons/ionicons5'
import dayjs from 'dayjs'
import { DropdownProps } from 'naive-ui'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { createNewRecord, renderIcon } from './utils'

const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })

const records = ref<RecordType[]>([])

const getLocalRecord = async () => {
  const keys = await localforage.keys()
  const list = (await Promise.all(
    keys.map((key) => localforage.getItem(key))
  )) as RecordType[]

  records.value = list
}

// 读取本地记录数据
getLocalRecord()

const languageOptions: DropdownProps['options'] = [
  {
    label: '中文',
    key: 'zh'
  },
  {
    label: 'English',
    key: 'en'
  }
]

const handleLanguageChange = (value: string) => {
  locale.value = value
}

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
      router.push({ name: 'NewUpload' })
      const record = createNewRecord(CreateType.NewRecord)
      const time = dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')
      await localforage.setItem(time, record)
      break
    }
    case CreateType.NewFolder: {
      const folder = createNewRecord(CreateType.NewFolder)
      const time = dayjs(folder.createdAt).format('YYYY-MM-DD HH:mm:ss')
      await localforage.setItem(time, folder)
      break
    }
  }
  await getLocalRecord()
}
</script>

<template>
  <n-layout :style="{ height: '100%' }">
    <n-layout-header bordered :style="{ height: '64px' }">
      <n-flex
        :style="{ height: '100%', padding: '0 24px' }"
        justify="space-between"
        align="center"
      >
        <n-h1 prefix="bar" :style="{ margin: 0 }">{{ t('global.title') }}</n-h1>
        <n-flex align="center">
          <n-dropdown
            :value="locale"
            trigger="click"
            :options="languageOptions"
            @select="handleLanguageChange"
          >
            <n-button text style="font-size: 18px">
              <n-icon>
                <LanguageOutline />
              </n-icon>
            </n-button>
          </n-dropdown>
          <n-button
            text
            @click="
              () => {
                router.push({ name: 'About' })
              }
            "
          >
            {{ t('global.about') }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-layout-header>
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
          <Tree :raw-data="records" />
        </n-flex>
      </n-layout-sider>
      <n-layout-content>
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped></style>
