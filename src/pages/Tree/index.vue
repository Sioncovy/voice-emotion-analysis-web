<script setup lang="ts">
import { RecordType } from '@/types'
import { renderIcon } from '@/utils'
import localforage from '@/utils/localforage'
import { Folder, FolderOpenOutline, MicOutline } from '@vicons/ionicons5'
import _ from 'lodash'
import { TreeDropInfo, TreeOption, TreeProps } from 'naive-ui'
import { PropType, computed, ref, watch } from 'vue'

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
      const t = cur.isFolder
        ? {
            ...map[cur.id],
            prefix: renderIcon(Folder)
          }
        : {
            ...map[cur.id],
            prefix: renderIcon(MicOutline)
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
</script>

<template>
  <n-tree
    block-line
    :on-update:expanded-keys="updatePrefixWithExpaned"
    :data="treeData"
    draggable
    @drop="handleDrop"
  ></n-tree>
</template>

<style lang="less" scoped></style>
