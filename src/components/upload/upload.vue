<template>
  <a-upload action="/mock/upload" @preview="handlePreview" v-model:fileList="modelValue" list-type="picture-card"
    accept="image/png, image/jpeg">
    <div v-if="modelValue.length < 1">
      <PlusOutlined />
      <div style="margin-top: 8px">
        <slot />
      </div>
    </div>
  </a-upload>
</template>
<script setup lang="ts">
const props = defineProps(['fileList'])
const emit = defineEmits(['handlePreview', 'update:fileList'])

const modelValue = computed({
  get: () => props.fileList,
  set: val => emit('update:fileList', val)
})

function handlePreview() {
  emit('handlePreview')
}
</script>