import { Button } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { RollbackOutlined } from '@ant-design/icons-vue';

export const backRoute = () => {
  const route = useRoute();
  const router = useRouter();
  const title = route.meta.title as string;

  return (
    <div>
      <span>{title}</span>
      <Button
        type="link"
        onClick={() => {
          router.back();
        }}
      >
        <RollbackOutlined />
        返回上一级
      </Button>
    </div>
  );
};
