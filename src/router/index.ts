import { App } from 'vue';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { BasicLayout, UserLayout, BlankLayout } from '@/layouts';
import { createRouterGuards } from './createRouterGuards';

const routes = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    redirect: '/CopyrightDepository',
    meta: {
      title: 'NFT Admin',
    },
    children: [
      {
        path: '/CopyrightDepository',
        name: 'CopyrightDepository',
        meta: {
          title: '版权存证',
          icon: 'icon-banquan',
          hideChildrenInMenu: true,
        },
        component: BlankLayout,
        redirect: '/CopyrightDepository/index',
        children: [
          {
            path: '/CopyrightDepository/index',
            name: 'CopyrightDepositoryIndex',
            meta: {
              title: '版权存证',
              icon: 'icon-banquan',
              keepAlive: true,
              hideInMenu: true,
            },
            component: () => import('@/views/CopyrightDepository/CopyrightDepository.vue'),
          },
          {
            path: '/CopyrightDepository/form',
            name: 'CopyrightDepositoryForm',
            meta: {
              title: '版权存证信息',
              icon: 'icon-banquan',
              keepAlive: true,
              hideInMenu: true,
            },
            component: () => import('@/views/CopyrightDepository/CopyrightDepositoryForm.vue'),
          },
        ],
      },

      {
        path: '/CopyrightManagement',
        name: 'CopyrightManagement',
        meta: {
          title: '版权管理',
          icon: 'icon-hetong',
        },
        component: () => import('@/views/CopyrightManagement/CopyrightManagement.vue'),
      },
      {
        path: '/TradingMarket',
        name: 'TradingMarket',
        meta: {
          title: '交易市场',
          icon: 'icon-fapiao',
        },
        component: () => import('@/views/TradingMarket/TradingMarket.vue'),
      },
      {
        path: '/NotificationHub',
        name: 'NotificationHub',
        meta: {
          title: '通知中心',
          icon: 'icon-mail',
        },
        component: () => import('@/views/NotificationHub/NotificationHub.vue'),
      },
    ],
  },
  {
    path: '/user',
    name: 'user',
    component: UserLayout,
    hidden: true,
    redirect: '/user/auth',
    children: [
      {
        path: '/user/auth',
        name: 'auth',
        meta: {
          title: '登录/注册',
        },
        component: () => import('@/views/User/auth.vue'),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export function setupRouter(app: App) {
  createRouterGuards(router);
  app.use(router);
}
