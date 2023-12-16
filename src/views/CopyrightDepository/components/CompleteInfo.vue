<template>
  <div class="px-1 py-8 container mx-auto md:px-8 md:w-[768px]">
    <p>作品名称： <span class="underline">{{ modelData.workName }}</span> </p>
    <a-form v-show="state.page === 1" size="large" :labelCol="{ span: 8 }">
      <a-row :gutter="24" :wrap="true">
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="作品类型" v-bind="validateInfos.workType">
            <a-select v-model:value="workType" :options="workTypeOpts" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="作品创作性质" v-bind="validateInfos.creativeNature">
            <a-select v-model:value="creativeNature" :options="creativeNatureOpts" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="作品完成时间" v-bind="validateInfos.workCompleteTime">
            <a-date-picker class="w-full" v-model:value="workCompleteTime" placeholder="" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="作品完成地点" v-bind="validateInfos.workCompletePlace">
            <a-input v-model:value="workCompletePlace" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="作品发表状态" v-bind="validateInfos.publicationStatus">
            <a-select v-model:value="publicationStatus" :options="publicationStatusOpts" />
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="权利取得方式" v-bind="validateInfos.entitlementOfMethod">
            <a-select v-model:value="entitlementOfMethod" :options="entitlementOfMethodOpts" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="权利归属方式" v-bind="validateInfos.attributionOfRights">
            <a-select v-model:value="attributionOfRights" :options="attributionOfRightsOpts" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="是否允许公示" v-bind="validateInfos.public">
            <a-select v-model:value="isPublic" :options="publicOpts" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-table :scroll="{ x: true }" v-show="state.page === 2" :row-key="record => record.id" :bordered="true"
      :data-source="result?.data" :columns="columns" @change="run" :loading="loading" :pagination="pagination">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'ownership'">
          <a-checkbox-group class="w-full">
            <a-row :gutter="24" :wrap="true">
              <a-col :span="6" v-for="item in ownershipOpts" :key="item" :value="item">
                <a-checkbox :value="record.id + item">{{ item }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </template>
      </template>
    </a-table>
    <div class="flex justify-between w-full mt-4 space-x-4">
      <a-button @click="prevStep">返回上一步</a-button>
      <div class="flex justify-between space-x-4">
        <a-button @click="handleChangePage">{{ state.page === 1 ? '下一页' : '上一页' }}</a-button>
        <a-button @click="nextStep" type="primary">下一步，提交证明</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { TableColumnProps } from "ant-design-vue";
import { useWorkInfo, workTypeOpts, publicationStatusOpts, entitlementOfMethodOpts, creativeNatureOpts, attributionOfRightsOpts, publicOpts, ownershipOpts } from "./useWorkInfo"
import { usePagination } from "vue-request";
import { request } from "@/utils/http";
const { validate, validateInfos, workType, workCompletePlace, workCompleteTime, publicationStatus, isPublic, entitlementOfMethod, attributionOfRights, creativeNature, modelRef } = useWorkInfo()
defineProps<{ modelData: any }>()
const emit = defineEmits<{
  (event: 'nextStep', data: any): void
  (event: 'prevStep'): void
}>()

const state = reactive({
  showError: false,
  page: 1,
  loading: false
})

const columns: TableColumnProps[] = [
  { title: "著作人名称", dataIndex: "authorName", key: "authorName" },
  { title: "拥有权称", dataIndex: "ownership", key: "ownership" }
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

function queryData(params: any) {
  return request({
    url: "/mock/copyright/author/list",
    method: "get",
    params
  })
}
onMounted(() => {
  run({ current: 1, pageSize: 5 })
})

async function handleChangePage() {
  await validate()
  if (state.page === 1) {
    state.page += 1
  } else {
    state.page -= 1
  }

}


function nextStep() {
  state.page = 2
  emit('nextStep', modelRef)
}


function prevStep() {
  state.page = 1
  emit('prevStep')
}


</script>