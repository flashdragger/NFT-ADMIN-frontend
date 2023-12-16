<template>
  <page-container :title="title">
    <a-dropdown class="mb-4" v-for="item in state.dataList" :key="item.id" :trigger="['contextmenu']">
      <a-card hoverable @click="() => handleClick(item)">
        <div class="flex justify-between">
          <div>
            <a-badge class="badge" :status="item.status === 'unread' ? 'error' : 'success'" />
            <span>{{ item.title }}</span>
          </div>
          <div>
            <span :class="item.status === 'unread' ? 'text-[#ff4d4f]' : 'text-[#52c41a]'">{{ statusText[item.status]
            }}</span>
          </div>
        </div>
      </a-card>
      <template #overlay>
        <a-menu @click="(key) => handleClickMenu(key, item.id)" class="custom-menu">
          <a-menu-item key="ignore" v-if="item.status === 'unread'">忽略</a-menu-item>
          <a-menu-item key="delete" class="hover:bg-[#ff4d4f]">删除</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <a-skeleton v-if="state.loading" />

    <a-result v-if="state.dataList.length === 0 && !state.loading" title="暂无任何通知">
    </a-result>

    <a-modal :footer="null" v-model:visible="state.visible" title="Nakamigos">
      <p>您的共同著作权人： Jack 对该作品提出了变更申请。变更如下：</p>

      <div class="flex justify-between">
        <a-badge-ribbon text="原">
          <a-card size="small">
            <p>著作权人</p>
            <ul>
              <li>
                Jack: （3332355555xxxx）
              </li>
              <li>
                rose: （3334561111xxxx）
              </li>
              <li>
                solor: （3243235587xxxx）
              </li>
            </ul>
          </a-card>
        </a-badge-ribbon>
        <a-badge-ribbon text="改" color="green">
          <a-card size="small">
            <p>著作权人</p>
            <ul>
              <li>
                Jack: （3332355555xxxx）
              </li>
              <li>
                rose: （3334561111xxxx）
              </li>
            </ul>
          </a-card>
        </a-badge-ribbon>
      </div>
      <a-button class="mt-4" block danger>
        已拒绝
      </a-button>
    </a-modal>
  </page-container>
</template>
<script lang="ts" setup>
import { request } from '@/utils/http';
import { Modal } from "ant-design-vue"
interface NoticeDto {
  id: number
  status: 'unread' | 'processed'
  title: string
  modal: 'confirm' | 'custom'
}

const statusText = {
  'unread': '未读',
  'processed': '已处理'
}


const route = useRoute()
const { title } = route.meta

const state = reactive({
  dataList: [] as NoticeDto[],
  loading: false,
  visible: false
})

async function getDataList() {
  state.loading = true
  const { data } = await request<NoticeDto[]>({
    url: '/mock/notice/list',
    method: "get"
  }).finally(() => state.loading = false)
  state.dataList = data
}

getDataList()

function handleClickMenu({ key }, id: number) {
  // const list = [...state.dataList]
  const index = state.dataList.findIndex(item => item.id === id)
  if (key === 'ignore') {
    state.dataList[index].status = 'processed'
    state.dataList[index].id = state.dataList.length + 1
  }
  if (key === 'delete') {
    state.dataList.splice(index, 1)
  }
}

function handleClick(item: NoticeDto) {
  if (item.modal === 'confirm') {
    Modal.confirm({
      content: item.title,
      okText: "知道了",
      cancelText: "返回",
      onOk() {
        item.status = 'processed'
      }
    })
  } else {
    state.visible = true
  }
}
</script>
<style lang="less">
.custom-menu {
  .ant-dropdown-menu-item:last-child {
    color: #ff4d4f !important;

    &:hover {
      color: white !important;
      background-color: #ff4d4f !important;
    }
  }
}
</style>
