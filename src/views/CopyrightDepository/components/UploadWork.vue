<template>
  <div class="px-1 py-8 container mx-auto md:px-8 md:w-[768px]">
    <a-form size="large" label-align="right" :labelCol="{ span: 4 }">
      <a-form-item label="上传文件" v-bind="validateInfos.fileList">
        <a-upload-dragger action="/mock/upload" name="file" :multiple="true" list-type="picture-card"
          v-model:file-list="modelRef.file">
          <p class="ant-upload-drag-icon">
            <InboxOutlined></InboxOutlined>
          </p>
          <p class="text-gray-700">点击或者将文件拖拽到此处</p>
        </a-upload-dragger>
      </a-form-item>
      <a-form-item label="作品名称" v-bind="validateInfos.workName">
        <a-input v-model:value="modelRef.workName"></a-input>
      </a-form-item>
      <a-form-item label="作品描述" v-bind="validateInfos.workDescription">
        <a-textarea :rows="4" v-model:value="modelRef.workDescription"></a-textarea>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" @click="nextStep">下一步，填写著作人</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { Form } from "ant-design-vue"
import { InboxOutlined } from "@ant-design/icons-vue"
import { RuleObject } from "ant-design-vue/es/form";
const { useForm } = Form
defineProps<{ modelData: any }>()
const emit = defineEmits<{
  (event: 'nextStep', data: any): void
}>()

const modelRef = reactive({
  file: [],
  workName: '',
  workDescription: ""
})

const rulesRef: Record<string, RuleObject[]> = {
  file: [
    {
      type: "array",
      required: true,
      message: "文件不能为空"
    },
  ],
  workName: [
    {
      required: true,
      message: "作品名称不能为空"
    }
  ]
}

const { validate, validateInfos } = useForm(modelRef, rulesRef)


async function nextStep() {
  await validate()
  emit('nextStep', modelRef)
}
</script>