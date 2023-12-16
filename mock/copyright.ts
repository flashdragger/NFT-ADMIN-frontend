import { Random } from 'mockjs';
import { MockMethod } from 'vite-plugin-mock';

let autorList: any[] = [];
for (let index = 0; index < 100; index++) {
  const item = {
    id: index,
    authorName: Random.name(),
    authorType: '个人',
    IDType: '身份证',
    IDNumber: Random.string('number', 18),
  };
  autorList.push(item);
}

let workList: any[] = [];
for (let index = 0; index < 100; index++) {
  const item = {
    id: index,
    name: Random.name(),
    uploadDate: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    status: index % 2 === 0 ? '已上链' : '未生成证书',
  };
  workList.push(item);
}

export default [
  {
    url: '/mock/copyright/author/list',
    method: 'get',
    timeout: 1000,
    response: ({ query }) => {
      const { current, pageSize } = query;
      return {
        errno: 0,
        total: 100,
        data: autorList.slice((current - 1) * pageSize, current * pageSize),
        errmsg: '请求成功',
      };
    },
  },
  {
    url: '/mock/copyright/list',
    method: 'get',
    timeout: 1000,
    response: ({ query }) => {
      const { current, pageSize } = query;
      return {
        errno: 0,
        total: 100,
        data: workList.slice((current - 1) * pageSize, current * pageSize),
        errmsg: '请求成功',
      };
    },
  },
  {
    url: '/mock/notice/list',
    method: 'get',
    timeout: 1000,
    response: ({ query }) => {
      return {
        errno: 0,
        total: 100,
        data: [
          {
            id: 1,
            title: '您的作品：Saved Souls 版权存证成功',
            status: 'unread',
            modal: 'confirm',
          },
          {
            id: 2,
            title: '您已成为作品：Redacted Remilio 著作权人',
            status: 'unread',
            modal: 'confirm',
          },
          {
            id: 3,
            title: '您的作品：Nakamigos 存在变更申请',
            status: 'processed',
            modal: 'custom',
          },
        ],
        errmsg: '请求成功',
      };
    },
  },
] as MockMethod[];
