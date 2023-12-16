<template>
  <div>
    <div class="flex justify-around">
      <a-button class="!px-6" type="primary" size="large" @click="handleClickLogin">登录</a-button>
      <a-button class="!px-6" type="primary" size="large" @click="handleClickRegister">注册</a-button>
    </div>
    <a-modal :width="modalWidth" v-model:open="visible" :title="type === 'login' ? '登录' : '注册'" :footer="null"
      :after-close="resetFields">
      <a-form @submit="submit">
        <a-form-item label="用户名">
          <a-input v-model:value="username" v-bind="validateInfos.username">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="手机号" v-if="type === 'register'">
          <a-input-password v-model:value="mobile" v-bind="validateInfos.mobile">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item label="密&emsp;码">
          <a-input-password v-model:value="password" v-bind="validateInfos.username">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button :loading="loading" block type="primary" html-type="submit">
            {{ type === 'login' ? '立即登录' : '立即注册' }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue"
import { useAuth } from "./useAuth"
import { useUserStore } from "@/store";
import { useModalWidth } from "@/hooks/useModalWidth";
const router = useRouter()
const userStore = useUserStore()
const { modalWidth } = useModalWidth()
const { type, visible, validate, validateInfos, resetFields, username, password, mobile } = useAuth()
const loading = ref(false)
function handleClickLogin() {
  visible.value = true
  type.value = 'login'
}

function handleClickRegister() {
  visible.value = true
  type.value = 'register'
}

async function submit() {
  const validateFields = ['username', 'password', 'mobile']
  if (type.value === 'login') {
    validateFields.splice(2, 1)
  }
  validate(validateFields).then(() => {
    loading.value = true
    userStore.loginOrRegister(type.value, { username: username.value, password: password.value, mobile: mobile.value })
      .then(() => router.push('/'))
      .finally(() => loading.value = false)

  })

}
</script>