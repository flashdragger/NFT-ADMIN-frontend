import { App } from 'vue';
import useModal from '@/hooks/useModal';

export function setupPlugin(app: App) {
  app.use(useModal);
}
