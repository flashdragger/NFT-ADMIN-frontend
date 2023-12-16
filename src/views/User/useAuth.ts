import { Form } from 'ant-design-vue';
import { RuleObject } from 'ant-design-vue/lib/form';
const useForm = Form.useForm;
export interface LoginDto {
  username: string;
  password: string;
}

export const useAuth = () => {
  const state = reactive<{ visible: boolean; type: 'login' | 'register' }>({
    visible: false,
    type: 'login',
  });
  const modelRef = reactive({
    username: '',
    password: '',
    mobile: '',
  });
  const rules: Record<string, RuleObject[]> = {
    username: [
      {
        required: true,
        message: '请输入用户名',
        type: 'string',
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
        type: 'string',
      },
    ],
    mobile: [
      {
        required: true,
        message: '请输入手机号',
        type: 'string',
      },
    ],
  };

  const { validate, validateInfos, resetFields } = useForm(modelRef, rules);

  return {
    ...toRefs(state),
    ...toRefs(modelRef),
    validate,
    validateInfos,
    resetFields,
  };
};
