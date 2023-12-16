import { useWindowSize } from '@vueuse/core';

export const useModalWidth = (defaultWidth?: number) => {
  const { width } = useWindowSize();
  const isMobile = inject<Ref<boolean>>('isMobile');
  const modalWidth = computed(() => (isMobile?.value ? width.value * 0.8 : defaultWidth || 420));

  return { modalWidth };
};
