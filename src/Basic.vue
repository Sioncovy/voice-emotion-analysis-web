<script setup lang="ts">
import Advice from '@/pages/Advice/index.vue'
import {
  Help,
  LanguageOutline,
  MicOutline,
  ShareSocialOutline
} from '@vicons/ionicons5'
import { DropdownProps, MenuOption, NIcon } from 'naive-ui'
import { Component, h, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { AUTH_TOKEN_KEY } from './config'
import { useStore } from './store'

const { t, locale } = useI18n({ useScope: 'global' })
const router = useRouter()
const store = useStore()
console.log('✨  ~ store:', store)

const adviceOpen = ref(false)
const tab = ref<'analysis' | 'share'>('analysis')

const route = useRoute()

watch(
  () => route.name,
  (name) => {
    if (name === 'Analysis' || name === 'Home') {
      tab.value = 'analysis'
    } else if (name === 'Share') {
      tab.value = 'share'
    }
  },
  { immediate: true }
)

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

const dropdownOptions: MenuOption[] = [
  {
    label: () => t('menu.logout'),
    key: 'logout'
  }
]

const selectHandle = (key: string) => {
  if (key === 'logout') {
    store.userInfo = null
    localStorage.removeItem(AUTH_TOKEN_KEY)
    router.push('/login')
  }
}

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () => t('menu.analysis'),
    key: 'analysis',
    icon: renderIcon(MicOutline)
  },
  {
    label: () => t('menu.share'),
    key: 'share',
    icon: renderIcon(ShareSocialOutline)
  }
]
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
          <n-float-button
            :bottom="40"
            :right="40"
            style="z-index: 100"
            type="primary"
            @click="
              () => {
                adviceOpen = true
              }
            "
          >
            <n-icon>
              <Help />
            </n-icon>
          </n-float-button>
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
          <n-dropdown
            trigger="click"
            :options="dropdownOptions"
            @select="selectHandle"
          >
            <n-avatar
              size="small"
              shape="circle"
              style="margin-left: 8px"
              :src="store.userInfo?.avatar"
            />
          </n-dropdown>
        </n-flex>
      </n-flex>
    </n-layout-header>
    <n-layout has-sider :style="{ height: 'calc(100vh - 64px)' }">
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        collapsed
        :width="240"
        :native-scrollbar="false"
      >
        <n-menu
          :inverted="false"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          collapsed
          :options="menuOptions"
          :value="tab"
          @update:value="(value) => {
            tab = value as 'analysis' | 'share'
            if (tab === 'analysis') {
              router.push({ name: 'Analysis' })
            } else {
              router.push({ name: 'Share' })
            }
          }"
        />
      </n-layout-sider>
      <n-layout-content>
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-layout>
  <n-modal
    :show="adviceOpen"
    preset="card"
    style="width: 600px"
    title="问题列表"
    @close="
      () => {
        adviceOpen = false
      }
    "
  >
    <Advice />
  </n-modal>
</template>

<style lang="less" scoped></style>
