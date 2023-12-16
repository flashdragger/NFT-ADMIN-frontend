import { createStorage } from '@/utils/Storage';
import { defineStore } from 'pinia';
import { ACCESS_TOKEN, CURRENT_USER } from './mutation-types';
import { request } from '@/utils/http';
import { LoginDto } from '@/views/User/useAuth';

const Storage = createStorage({ storage: localStorage });

interface IUserState {
  currentUser?: {
    token: string;
    username: string;
  };
}

export const useUserStore = defineStore('userStore', {
  state: (): IUserState => ({
    currentUser: Storage.get(CURRENT_USER, { token: '', username: '' }),
  }),
  actions: {
    async loginOrRegister(type: 'login' | 'register', dto: any) {
      const { data } = await request(
        {
          url: `/mock/user/${type}`,
          method: 'post',
          data: dto,
        },
        { isShowSuccessMessage: true },
      );
      this.currentUser = data;
      Storage.set(CURRENT_USER, data);
      return data;
    },

    logout() {
      this.currentUser = undefined;
      Storage.clear();
    },
  },
});
