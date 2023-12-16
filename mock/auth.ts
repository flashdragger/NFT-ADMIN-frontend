import { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/mock/user/login',
    method: 'post',
    timeout: 1000,
    response: ({ body }) => {
      const { username } = body;
      return {
        code: 0,
        data: {
          token: '662C63B4-FD43-66F4-3328-C54E3FF0D56E',
          username,
        },
        message: '登录成功',
      };
    },
  },
  {
    url: '/mock/user/register',
    method: 'post',
    timeout: 1000,
    response: ({ body }) => {
      const { username } = body;
      return {
        code: 0,
        data: {
          token: '662C63B4-FD43-66F4-3328-C54E3FF0D56E',
          username,
        },
        message: '注册成功',
      };
    },
  },
  {
    url: '/mock/upload',
    method: 'post',
    timeout: 1000,
  },
] as MockMethod[];
