import { FormItemSchema } from '@/components/schema-form';
import { LoginDto } from './useAuth';

export const formSchemas: FormItemSchema<LoginDto>[] = [
  {
    label: '用户名',
    field: 'username',
    component: 'Input',
    rules: [{ required: true, type: 'string' }],
  },
  {
    label: '密码',
    field: 'password',
    component: 'InputPassword',
    rules: [{ required: true, type: 'string' }],
  },
];
