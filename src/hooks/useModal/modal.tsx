import { Modal, Drawer, Button } from 'ant-design-vue';
import { defineComponent, reactive, watchEffect, watch, ref } from 'vue';
import type { HookModalProps } from './types';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { ConfigProvider } from 'ant-design-vue';
import { isFunction, omit } from 'lodash';

export const MyModal = defineComponent({
  setup(props: HookModalProps) {
    const confirmLoading = ref<boolean>(false);

    const state = reactive({
      visible: props.visible,
    });

    watchEffect(() => {
      state.visible = props.visible;
    });

    watch(
      () => state.visible,
      val => {
        Object.is(val, false) && props._closeModal?.();
      },
    );

    const handleConfirm = async (e: MouseEvent) => {
      confirmLoading.value = true;
      try {
        await props?.onOk?.(e);

        state.visible = false;
      } catch (error) {
      } finally {
        confirmLoading.value = false;
      }
    };
    const handleCancel = async (e: MouseEvent) => {
      await props?.onCancel?.(e);
      state.visible = false;
    };

    return () => {
      return (
        <ConfigProvider locale={zhCN}>
          {props.modalType === 'Drawer' ? (
            <Drawer
              {...omit(props, ['onCancel', 'onOk'])}
              v-model={[state.visible, 'visible']}
              onClose={handleCancel}
              footer={
                <div class="text-right">
                  <Button
                    style="margin-right: 8px"
                    onClick={handleCancel}
                    loading={confirmLoading.value}
                  >
                    返回
                  </Button>
                  <Button type="primary" onClick={handleConfirm} loading={confirmLoading.value}>
                    确定
                  </Button>
                </div>
              }
            >
              {isFunction(props.content) ? props.content() : props.content}
            </Drawer>
          ) : (
            <Modal
              {...omit(props, ['onCancel', 'onOk'])}
              v-model={[state.visible, 'visible']}
              confirmLoading={confirmLoading.value}
              onCancel={handleCancel}
              onOk={handleConfirm}
            >
              {isFunction(props.content) ? props.content() : props.content}
            </Modal>
          )}
        </ConfigProvider>
      );
    };
  },
});
