import axios, { AxiosRequestConfig } from 'axios';
import { message as $message, Modal } from 'ant-design-vue';
import { createStorage } from '@/utils/Storage';
import { ACCESS_TOKEN } from '@/store/mutation-types';

const Storage = createStorage({ storage: localStorage });

enum ResultEnum {
  SUCCESS = 0,
}

export interface RequestOptions {
  /** 是否直接获取data，而忽略message等 */
  isGetDataDirectly?: boolean;
  /** 请求成功时提示信息 */
  successMsg?: string;
  /** 请求失败时提示信息 */
  errorMsg?: string;
  isShowMessage?: boolean;
  isShowErrorMessage?: boolean;
  isShowSuccessMessage?: boolean;
  // /** 是否mock数据请求 */
  // isMock?: boolean
}

const UNKNOWN_ERROR = '未知错误，请重试';

const service = axios.create({
  timeout: 30 * 1000,
});

service.interceptors.request.use(
  config => {
    const token = Storage.get(ACCESS_TOKEN);
    if (token && config.headers) {
      // 请求头token信息，请根据实际情况进行修改
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

service.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const { response, code, message } = error || {};
    if (code && code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
      $message.error('接口请求超时,请刷新页面重试!');
      return;
    } else {
      const errMsg = error?.response?.data?.errmsg ?? UNKNOWN_ERROR;
      error.message = errMsg;
      $message.error(checkStatus(response && response.status, errMsg));
    }
    return Promise.reject(error);
  },
);

/**
 *
 * @param config
 * @param options
 */
export const request = async <R = any>(
  config: AxiosRequestConfig,
  options: RequestOptions = {},
): Promise<BasicResponseModel<R>> => {
  try {
    options = {
      successMsg: '',
      errorMsg: '',
      isShowMessage: true,
      isShowSuccessMessage: false,
      isShowErrorMessage: true,
      isGetDataDirectly: true,
      ...options,
    };
    const {
      successMsg,
      errorMsg,
      isShowMessage,
      isShowSuccessMessage,
      isShowErrorMessage,
      // isGetDataDirectly
    } = options;

    const response = await service.request(config);
    const { data } = response;
    if (isShowMessage) {
      if (data && Reflect.has(data, 'errno') && data.errno === ResultEnum.SUCCESS) {
        if (isShowSuccessMessage || successMsg) {
          $message.success(successMsg || data.errmsg);
        }
      } else {
        if (isShowErrorMessage || errorMsg) {
          $message.error(
            errorMsg || data.errmsg || checkStatus(data.errno, data.errmsg) || UNKNOWN_ERROR,
          );

          return Promise.reject(data);
        }
        if (data.errno == 403 || data.errno === 502) {
          Modal.confirm({
            title: '警告',
            content: data.errmsg || '账号异常，您可以取消停留在该页上，或重新登录',
            okText: '重新登录',
            cancelText: '取消',
            onOk: () => {
              localStorage.clear();
              window.location.reload();
            },
          });

          return Promise.reject(data);
        }
        return data;
      }
    }

    return data;
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export function checkStatus(status: number, msg: string): string {
  switch (status) {
    case 400:
      return `${msg}`;
      break;
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    case 401:
      return '用户没有权限（令牌、用户名、密码错误）!';
      // store.dispatch('user/loginOut', {
      //   goLogin: true,
      // });
      break;
    case 403:
      return `${msg}`;
      break;
    // 404请求不存在
    case 404:
      return '网络请求错误,未找到该资源!';
      break;
    case 405:
      return '网络请求错误,请求方法未允许!';
      break;
    case 408:
      return '网络请求超时!';
      break;
    case 500:
      return '服务器错误,请联系管理员!';
      break;
    case 501:
      return '网络未实现!';
      break;
    case 502:
      return '网络错误!';
      break;
    case 503:
      return '服务不可用，服务器暂时过载或维护!';
      break;
    case 504:
      return '网络超时!';
      break;
    case 505:
      return 'http版本不支持该请求!';
      break;
    default:
      return msg;
  }
}
