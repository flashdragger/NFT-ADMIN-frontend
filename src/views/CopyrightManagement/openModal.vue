<template>
  <a-modal :width="modalWidth" title="作品详情信息" v-model:open="visible" :footer="null" @cancel="handleCancel">
    <a-descriptions layout="vertical" bordered>
      <a-descriptions-item label="作品名称">{{ modelRef.name }}</a-descriptions-item>
      <a-descriptions-item label="上传时间">{{ modelRef.uploadDate }}</a-descriptions-item>
      <a-descriptions-item label="状态"><a-tag :color="modelRef.status === '未生成证书' ? 'volcano' : 'geekblue'">
          {{ modelRef.status }}
        </a-tag></a-descriptions-item>
    </a-descriptions>
    <a-divider />
    <a-form size="large" :labelCol="{ span: 8 }">
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
            <a-date-picker class="w-full" format="YYYY-MM-DD" v-model:value="workCompleteTime" placeholder="" />
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
    <div class="flex justify-center w-full">
      <a-button size="large" type="primary" @click="submit">{{ modelRef.status === '未生成证书' ? '生成证书' : '查看证书' }}</a-button>
    </div>
  </a-modal>

  <a-modal v-model:open="CertificationCertificateVisible" :footer="null" centered>
    <div class="relative">
      <div class="absolute left-[175px] top-[218px] space-y-4">
        <div>张国平</div>
        <div>文学作品</div>
        <div>细致的围虾</div>
        <div>{{ dayjs().format('YYYY-MM-DD HH-mm-ss') }}</div>
        <div>f52d885484f1215ea500a805a86</div>
      </div>
      <img src="/CertificationCertificate.png" alt="" />
    </div>
  </a-modal>
</template>
<script setup lang="tsx">
import { useModalWidth } from "@/hooks/useModalWidth";
import { Modal, notification } from "ant-design-vue"
import { useWorkInfo, workTypeOpts, publicationStatusOpts, entitlementOfMethodOpts, creativeNatureOpts, attributionOfRightsOpts, publicOpts } from "../CopyrightDepository/components/useWorkInfo"
import dayjs from "dayjs";
const { clearValidate, resetFields, validate, validateInfos, workType, workCompletePlace, workCompleteTime, publicationStatus, isPublic, entitlementOfMethod, attributionOfRights, creativeNature } = useWorkInfo()
const { modalWidth } = useModalWidth(750)
const visible = ref(false)
const CertificationCertificateVisible = ref(false)
const modelRef = reactive({
  name: "",
  uploadDate: "",
  status: ""
})

const open = (record: any) => {
  Object.assign(modelRef, record)
  visible.value = true
}

function handleCancel() {
  clearValidate()
  resetFields()
}

async function submit() {
  await validate()
  if (modelRef.status === '未生成证书') {
    notification.success({ message: "生成证书成功" })
  } else {
    CertificationCertificateVisible.value = true
  }
}

defineExpose({
  open
})

</script>