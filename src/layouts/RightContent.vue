<template>
  <div class="mr-4">
    <a-dropdown>
      <template #overlay>
        <a-menu @click="handleClick">
          <!-- <a-menu-item>
            <template #icon>
              <SettingOutlined />
            </template>
            <span>个人设置</span>
          </a-menu-item> -->
          <a-menu-item key="logout">
            <template #icon>
              <LogoutOutlined />
            </template>
            <span>退出登录</span>
          </a-menu-item>
        </a-menu>
      </template>
      <a-space class="cursor-pointer">
        <a-avatar shape="circle" size="small" style="background-color: #1890ff">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        欢迎,{{ currentUser?.username }}
      </a-space>
    </a-dropdown>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons-vue';
const userStore = useUserStore()
const currentUser = userStore.currentUser

function handleClick({ key }) {
  if (key === 'logout') {
    userStore.logout()
    window.location.reload()
  }
}
</script>

