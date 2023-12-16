import 'virtual:windi.css';
import '@ant-design-vue/pro-layout/dist/style.css';
import { createApp } from 'vue';
import { setupRouter } from './router';
import App from './App.vue';
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout';
import { setupStore } from './store';
import { setupPlugin } from './plugins';

function renderApp(props: IRenderProps) {
  const { container } = props;
  const instance = createApp(App);
  instance.use(ProLayout).use(PageContainer);
  setupRouter(instance);
  setupStore(instance);
  setupPlugin(instance);
  instance.mount(container);
}

interface IRenderProps {
  container: Element | string;
}

renderApp({ container: '#app' });
