<script setup lang="ts">
import { Add, LanguageOutline, SearchOutline } from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
// import Tree from '@/pages/Tree'
import { DropdownProps } from 'naive-ui'
import Tree from './pages/Tree/index.vue'

const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })

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
        :width="240"
        show-trigger="bar"
        bordered
        content-style="padding: 24px;"
        :native-scrollbar="false"
      >
        <n-flex vertical>
          <n-button
            type="primary"
            ghost
            style="width: 100%"
            @click="
              () => {
                router.push({ name: 'NewUpload' })
              }
            "
          >
            <template #icon>
              <n-icon>
                <Add />
              </n-icon>
            </template>
            {{ t('sider.new') }}</n-button
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
              <n-button type="info" size="small">
                <n-icon :component="Add" />
              </n-button>
            </n-flex>
            <Tree />
          </n-flex>
        </n-flex>
      </n-layout-sider>
      <n-layout-content>
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped></style>
