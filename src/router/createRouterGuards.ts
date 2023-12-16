import { Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import { useUserStore } from '@/store';
NProgress.configure({ showSpinner: false }); // NProgress Configuration

const WHITEROUTES = ['user', 'auth'];

export function createRouterGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (WHITEROUTES.includes(to.name as string)) {
      next();
    } else {
      if (!userStore.currentUser?.token) {
        next({ path: '/user' });
      }
      next();
    }
  });
  router.afterEach(() => {
    NProgress.done();
  });
}
