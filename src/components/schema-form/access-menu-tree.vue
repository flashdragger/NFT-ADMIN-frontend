<template>
  <a-spin :spinning="spinning">
    <a-tree v-model:checkedKeys="checkedKeys" style="min-height: 40px" checkable checkStrictly :selectable="false"
      :tree-data="treeData" :fieldNames="replaceFields" @check="onCheck" treeDefaultExpandAll v-bind="$attrs" />
  </a-spin>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from 'vue'
import { Tree, Spin } from 'ant-design-vue'
import { TreeNodeProps } from 'ant-design-vue/es/vc-tree-select/TreeNode'

export default defineComponent({
  name: 'AccessTree',
  components: { [Tree.name]: Tree, [Spin.name]: Spin }, // 双向数据绑定
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const state = reactive({
      treeData: [] as any,
      spinning: false,
      replaceFields: {
        key: 'id',
        value: 'id',
        title: 'name',
      },
    })

    // // 列表转树

    // const list2tree = (items, parentId = 0) => {
    //   return items.map((item) => ({
    //     ...item,
    //     title: item.name,
    //     children: [],
    //     isLeaf: !item.hasChild
    //   }))
    // }

    // 已勾选的节点
    const checkedKeys = computed({
      get: () => props.value,
      set: (val: any) => emit('update:value', Array.isArray(val) ? val : val.checked),
    })

    // 获取所有父节点的key
    const getParentsKey = (treeNode: TreeNodeProps, arr: number[] = []): number[] => {
      if (treeNode.eventKey) {
        arr.push(parseInt(treeNode.eventKey as string))
        return getParentsKey(treeNode.vcTreeNode, arr)
      }
      return arr
    }

    // 获取所有子节点的key
    const getChildrenKeys = (treeNode: TreeNodeProps, arr: number[] = []) => {
      if (treeNode?.children.length > 0) {
        return treeNode.children.reduce((prev: any, curr: TreeNodeProps) => {
          if (curr.children.length > 0) {
            prev.push(...getChildrenKeys(curr, prev), [])
          }
          return prev.concat([curr.id])
        }, arr)
      }
      return arr
    }

    // 勾选事件处理函数
    const onCheck = (keys: { checked: any[] }, { node, checked }: any) => {
      let tempKeys: number[] = checkedKeys.value as number[]
      // 子节点选中，父节点必然要选中
      if (checked) {
        tempKeys = [
          ...new Set([
            ...checkedKeys.value,
            ...keys.checked,
            ...getParentsKey(node.vcTreeNode),
            ...getChildrenKeys(node.dataRef),
          ]),
        ]
      } else {
        const childrenKeys = getChildrenKeys(node.dataRef)

        if (childrenKeys.length > 0) {
          tempKeys = keys.checked.filter((item: any) => !childrenKeys.includes(item))
        } else {
          tempKeys = keys.checked
        }
        // 获取所有同级节点
        const children = node.vcTreeNode?.dataRef?.children?.map((item: { id: any }) => item.id) || []
        // 如果当前所有选中的节点中没有包含任何一个直属子节点
        if (!children.some((item: number) => tempKeys.includes(item))) {
          tempKeys = tempKeys.filter((item) => item != node.vcTreeNode?.eventKey)
        }
      }
      checkedKeys.value = tempKeys
    }

    return {
      ...toRefs(state),
      checkedKeys,
      onCheck,
    }
  },
})
</script>

<style scoped></style>
