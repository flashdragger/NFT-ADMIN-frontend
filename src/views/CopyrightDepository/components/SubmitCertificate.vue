<template>
  <div class="px-1 py-8 container mx-auto md:px-8 md:w-[768px]">
    <p>作品名称： <span class="underline">Pepemigos</span></p>
    <a-form size="large">
      <a-form-item label="证明材料" :required="true">
        <a-upload-dragger action="/mock/upload" name="file" :multiple="true" list-type="picture-card"
          v-model:file-list="modelRef.fileList">
          <p class="ant-upload-drag-icon">
            <InboxOutlined></InboxOutlined>
          </p>
          <p class="text-gray-700">点击或者将文件拖拽到此处</p>
        </a-upload-dragger>
      </a-form-item>
      <a-alert class="my-1 transition-all" type="error" message="请上传证明材料" banner v-if="state.showError" :closable="true"
        :after-close="() => state.showError = false" />
    </a-form>

    <div class="flex justify-center w-full mt-4 space-x-4">
      <a-button @click="prevStep">返回上一步</a-button>
      <a-button @click="submit" type="primary" :loading="state.loading">提交申请</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { notification } from 'ant-design-vue';
const emit = defineEmits<{
  (event: 'prevStep'): void
}>()

const state = reactive<{
  showError: boolean;
  loading: boolean
}>({
  showError: false,
  loading: false
});

const modelRef = reactive({
  fileList: []
})

function submit() {
  if (modelRef.fileList.length === 0) {
    state.showError = true
    return
  }
  state.loading = true
  setTimeout(() => {
    state.loading = false
    notification.success({
      message: '提交成功 !',
      description: "可在 [版权管理] 中查看作品状态"
    })
  }, 2000);

}

function prevStep() {
  emit('prevStep')
}

</script>