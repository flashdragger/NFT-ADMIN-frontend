<template>
  <div class="px-1 py-8 container mx-auto md:px-8 md:w-[768px]">
    <p>作品名称： <span class="underline">{{ modelData.workName }}</span> </p>
    <div class="mt-4">
      <div class="flex justify-between">
        <p>选择著作人</p>
        <a-button type="text" @click="state.visible = true">
          <template #icon>
            <PlusOutlined />
          </template>
          添加著作人
        </a-button>
      </div>
      <a-table :row-key="record => record.id" :bordered="true" :data-source="result?.data" :pagination="pagination"
        :loading="loading" @change="run" :columns="columns" :row-selection="{
          selectedRowKeys: modelRef.authors, onChange: onSelectChange, type: 'checkbox'
        }">
      </a-table>
      <a-alert class="my-1 transition-all" type="error" message="请选择著作人" banner v-if="state.showError" :closable="true"
        :after-close="() => state.showError = false" />
      <div class="flex mt-4 space-x-4">
        <a-button @click="prevStep">返回上一步</a-button>
        <a-button type="primary" @click="nextStep">下一步，完善信息</a-button>
      </div>
    </div>
    <AddAuthorForm v-model:visible="state.visible" />
  </div>
</template>
<script setup lang="ts">
import { request } from "@/utils/http";
import { PlusOutlined } from "@ant-design/icons-vue"
import { TableColumnProps } from "ant-design-vue";
import { Key } from "ant-design-vue/lib/table/interface";
import { usePagination } from 'vue-request';
import AddAuthorForm from "./AddAuthorForm.vue"
defineProps<{ modelData: any }>()
const emit = defineEmits<{
  (event: 'nextStep', data: any): void
  (event: 'prevStep'): void
}>()
const state = reactive<{
  loading: boolean;
  showError: boolean;
  visible: boolean
}>({
  loading: false,
  showError: false,
  visible: false
});

const modelRef = reactive({
  authors: [] as Key[]
})

const columns: TableColumnProps[] = [
  { title: "著作人类别", dataIndex: "authorType", },
  { title: "著作人名称", dataIndex: "authorName" },
  { title: "证件类型", dataIndex: "IDType" },
  { title: "证件号码", dataIndex: "IDNumber" }
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
  run({ current: 1, pageSize: 5 })
})


const onSelectChange = (selectedRowKeys: Key[]) => {
  modelRef.authors = selectedRowKeys;
};

function nextStep() {
  if (modelRef.authors.length < 1) {
    state.showError = true
  } else {
    emit('nextStep', modelRef)
  }
}

function prevStep() {
  emit('prevStep')
}

function queryData(params: any) {
  return request({
    url: "/mock/copyright/author/list",
    method: "get",
    params
  })
}

</script>