<script setup lang="ts">
import { RecordType } from '@/types'
import { renderIcon } from '@/utils'
import localforage from '@/utils/localforage'
import {
  EllipsisHorizontal,
  Folder,
  FolderOpenOutline,
  MicOutline
} from '@vicons/ionicons5'
import _ from 'lodash'
import {
  FormInst,
  NButton,
  NDropdown,
  TreeDropInfo,
  TreeOption,
  TreeOverrideNodeClickBehavior,
  TreeProps,
  useDialog,
  useMessage
} from 'naive-ui'
import { PropType, computed, h, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const message = useMessage()
const dialog = useDialog()
const router = useRouter()
const route = useRoute()

const current = ref<RecordType | null>(null)
const newTitle = ref('')
const modalOpen = ref(false)

const updatePrefixWithExpaned = (
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null
    action: 'expand' | 'collapse' | 'filter'
  }
) => {
  if (!meta.node) return
  switch (meta.action) {
    case 'expand':
      meta.node.prefix = renderIcon(FolderOpenOutline)
      break
    case 'collapse':
      meta.node.prefix = renderIcon(Folder)
      break
  }
}

const props = defineProps({
  rawData: {
    type: Array as PropType<RecordType[]>,
    required: true
  }
})

const emits = defineEmits(['getLocalRecord'])

const transformRawDataToTreeData = (rawData: RecordType[]) => {
  const data: Required<TreeProps>['data'] = rawData.map((item) => ({
    label: item.title,
    key: item.id,
    children: item.isFolder ? ([] as Required<TreeProps>['data']) : undefined,
    isLeaf: !item.isFolder
  }))
  const map = _.keyBy(data, 'key')

  const tree = _.reduce(
    rawData.sort((a, b) => {
      if (a.isFolder && !b.isFolder) {
        return -1
      } else if (!a.isFolder && b.isFolder) {
        return 1
      } else {
        return b.title.localeCompare(a.title)
      }
    }),
    (acc, cur) => {
      const t = {
        ...map[cur.id],
        prefix: cur.isFolder ? renderIcon(Folder) : renderIcon(MicOutline),
        suffix: () =>
          h(
            NDropdown,
            {
              trigger: 'click',
              options: [
                {
                  label: '重命名',
                  key: 'rename'
                },
                {
                  label: '删除',
                  key: 'delete'
                }
              ],
              onSelect: (value) => {
                switch (value) {
                  case 'rename': {
                    newTitle.value = cur.title
                    current.value = cur
                    modalOpen.value = true
                    break
                  }
                  case 'delete': {
                    dialog.warning({
                      title: '警告',
                      content: `你确定删除 ${cur.title}？`,
                      positiveText: '确定',
                      negativeText: '不确定',
                      onPositiveClick: () => {
                        localforage
                          .removeItem(cur.id)
                          .then(() => {
                            emits('getLocalRecord')
                            message.success('删除成功')
                          })
                          .catch(() => {
                            message.error('删除失败')
                          })
                      }
                    })
                    break
                  }
                }
              }
            },
            h(NButton, { text: true }, renderIcon(EllipsisHorizontal))
          )
      }

      if (cur.parentId === null) {
        acc.push(t)
      } else {
        const parent = map[cur.parentId]
        if (parent) {
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(t)
        }
      }
      return acc
    },
    [] as Required<TreeProps>['data']
  )
  return tree
}

// n-tree 使用的数据
const treeData = ref<TreeOption[]>([])

watch(
  () => props.rawData,
  (newVal) => {
    treeData.value = transformRawDataToTreeData(newVal)
  }
)

// 本地存储的原始记录数据
const dataMap = computed(() =>
  props.rawData.reduce((acc, cur) => {
    acc.set(cur.id, cur)
    return acc
  }, new Map<string, RecordType>())
)

function findSiblingsAndIndex(
  node: TreeOption,
  nodes?: TreeOption[]
): [TreeOption[], number] | [null, null] {
  if (!nodes) return [null, null]
  for (let i = 0; i < nodes.length; ++i) {
    const siblingNode = nodes[i]
    if (siblingNode.key === node.key) return [nodes, i]
    const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children)
    if (siblings && index !== null) return [siblings, index]
  }
  return [null, null]
}

// 处理拖拽相关逻辑
const handleDrop = ({ node, dragNode, dropPosition }: TreeDropInfo) => {
  const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
    dragNode,
    treeData.value
  )
  if (dragNodeSiblings === null || dragNodeIndex === null) return
  dragNodeSiblings.splice(dragNodeIndex, 1)
  if (dropPosition === 'inside') {
    console.log('inside', node, dragNode)
    // 更新本地存储
    const key = dragNode.key as string
    localforage.setItem(key, {
      ...dataMap.value.get(key),
      parentId: node.key as string
    })
    // 更新树数据（更新 UI）
    if (node.children) {
      node.children.unshift(dragNode)
    } else {
      node.children = [dragNode]
    }
  } else if (dropPosition === 'before') {
    console.log('before', node, dragNode)

    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, treeData.value)
    if (nodeSiblings === null || nodeIndex === null) return
    nodeSiblings.splice(nodeIndex, 0, dragNode)
  } else if (dropPosition === 'after') {
    console.log('after', node, dragNode)
    const key = dragNode.key as string
    const parentId = dataMap.value.get(node.key as string)?.parentId
    localforage.setItem(key, {
      ...dataMap.value.get(key),
      parentId
    })
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, treeData.value)
    if (nodeSiblings === null || nodeIndex === null) return
    nodeSiblings.splice(nodeIndex + 1, 0, dragNode)
  }
  treeData.value = Array.from(treeData.value)
}

const confirmRename = (e: MouseEvent) => {
  console.log(current?.value?.id, newTitle.value)
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success('修改成功')
    } else {
      console.log(errors)
      message.error('修改失败')
    }
  })

  localforage.setItem(current?.value?.id as string, {
    ...current.value,
    title: formValue.value.title
  })
  current.value = null
  formValue.value.title = ''
  modalOpen.value = false
  emits('getLocalRecord')
}

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  title: ''
})

const override: TreeOverrideNodeClickBehavior = ({ option }) => {
  if (option.children) {
    return 'toggleExpand'
  }
  router.push({ name: 'NewUpload', params: { id: option.key as string } })
  return 'default'
}
</script>

<template>
  <n-tree
    block-line
    :on-update:expanded-keys="updatePrefixWithExpaned"
    :data="treeData"
    draggable
    :selected-keys="[route.params.id as string]"
    @drop="handleDrop"
    :override-default-node-click-behavior="override"
  ></n-tree>
  <n-modal :show="modalOpen">
    <n-card style="width: 400px" title="重命名">
      <n-flex vertical>
        <n-form
          ref="formRef"
          :model="formValue"
          :rules="{
            title: {
              required: true,
              message: '标题不能为空',
              trigger: 'blur'
            }
          }"
        >
          <n-form-item label="标题" show-message="inline" path="title">
            <n-input v-model:value="formValue.title" placeholder="请输入" />
          </n-form-item>
          <n-form-item>
            <n-space :size="12">
              <n-button type="primary" @click="confirmRename">确定</n-button>
              <n-button @click="() => (modalOpen = false)">取消</n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </n-flex>
    </n-card>
  </n-modal>
</template>

<style lang="less" scoped></style>
