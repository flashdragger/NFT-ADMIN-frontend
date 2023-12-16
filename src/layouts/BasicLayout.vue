<template>
  <pro-layout v-model:collapsed="state.collapsed" v-model:selectedKeys="state.selectedKeys"
    v-model:openKeys="state.openKeys" :loading="loading" :menu-data="menuData" :breadcrumb="{ routes: breadcrumb }"
    style="min-height: 100vh" logo="/logo.png" v-bind="defaultSettings">
    <template #headerContentRender>
      <div class="ml-2">
        <a-tooltip title="刷新页面">
          <ReloadOutlined style="font-size: 18px;line-height:69px;cursor: pointer;" class="active:opacity-60"
            @click="handleClickReload" />
        </a-tooltip>
      </div>
    </template>
    <template #rightContentRender>
      <RightContentRender :current-user="currentUser" />
    </template>
    <transition name="zoom" mode="out-in" appear>
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
    </transition>
  </pro-layout>
</template>

<script lang="ts" setup>
import Icon from "@/components/Icon"
import { ReloadOutlined } from "@ant-design/icons-vue"
import RightContentRender from './RightContent.vue';
import defaultSettings from '@/config/defaultSettings';
import { RouteContextProps, clearMenuItem, getMenuData } from '@ant-design-vue/pro-layout';


const router = useRouter()
const { menuData } = getMenuData(clearMenuItem(router.getRoutes()))
console.log("router.currentRoute.value.matched", router.currentRoute.value.matched);

const breadcrumb = computed(() =>
  router.currentRoute.value.matched.concat().filter(item => !item.meta.hideChildrenInMenu).map(item => {
    return {
      path: item.path,
      breadcrumbName: item.meta.title || '',
    };
  }),
);
const state = reactive<Omit<RouteContextProps, 'menuData'>>({
  collapsed: false, // default collapsed
  openKeys: [], // defualt openKeys
  selectedKeys: [], // default selectedKeys
});

const currentUser = reactive({
  nickname: 'Admin',
  avatar: 'A',
});
watch(
  router.currentRoute,
  () => {
    const { matched } = router.currentRoute.value
    state.selectedKeys = matched.filter(r => r.name !== 'index').map(r => r.path);
    state.openKeys = matched.filter(r => r.path !== router.currentRoute.value.path).map(r => r.path);
  },
  {
    immediate: true,
  },
);

const isMobile = inject<boolean>('isMobile')
const reload = inject<Function>('reload')
const loading = ref(false)
const logo = computed(() => h(Icon, { icon: (isMobile && state.collapsed) ? 'icon-shuzicangpin-copy' : 'icon-shuzicangpin', class: "text-3xl" }))
function handleClickReload() {
  loading.value = true
  reload && reload(() => loading.value = false)
}

</script>

<style>
.ant-layout-header {
  height: 64px !important;
  line-height: 64px !important;
}
</style>

