<template>
  <page-container :title="title">
    <a-card>
      <a-table :bordered="true" :pagination="pagination" :loading="loading" :data-source="result?.data"
        :columns="columns">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <span> <a-tag :color="record.status === '未生成证书' ? 'green' : 'blue'">{{ record.status }}</a-tag></span>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <span> <a @click="handleOpenModal(record)">查看详情</a></span>
          </template>
        </template>
      </a-table>
    </a-card>

    <OpenModal ref="openModalRef" />
  </page-container>
</template>
<script setup lang="ts">
import { request } from '@/utils/http';
import { TableColumnProps } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import OpenModal from "./openModal.vue"

const route = useRoute()
const { title } = route.meta


const columns: TableColumnProps[] = [
  { title: "序号", dataIndex: "id", },
  { title: "作品名称", dataIndex: "name" },
  { title: "上传时间", dataIndex: "uploadDate" },
  { title: "状态", dataIndex: "status" },
  { title: "操作", dataIndex: "action" }
]

const {
  data: result,
  run,
  loading,
  current,
  pageSize,
  total,
} = usePagination(queryData, { manual: true, });

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
  pageSizeOptions: ['5', '10', '20', '40'],
}));

onMounted(() => {
  run({ current: 1, pageSize: 10 })
})

function queryData(params: any) {
  return request({
    url: "/mock/copyright/list",
    method: "get",
    params
  })
}

const openModalRef = ref<InstanceType<typeof OpenModal>>()

function handleOpenModal(record: any) {
  openModalRef.value?.open(record)
}

</script>
