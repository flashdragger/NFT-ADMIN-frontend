import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import jsxVue from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { fileURLToPath } from 'url';
import { viteMockServe } from 'vite-plugin-mock';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    jsxVue(),
    AutoImport({
      dts: 'src/auto-imports.d.ts',
      imports: ['vue', 'vue-router'],
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    Components({
      dts: 'src/components.d.ts',
      deep: true,
      dirs: ['src/components'],
      extensions: ['vue', 'tsx'],
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],
    }),
    viteMockServe({
      mockPath: 'mock',
    }),
  ],
  server: {
    proxy: {
      // 接口地址代理
      '/api': {
        target: 'http://localhost:8080', // 接口的域名
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/mock': {
        target: 'http://localhost:5173', // 接口的域名
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        rewrite: path => path.replace(/^\/mock/, '/mock'),
      },
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#1890ff',
        },
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['@ant-design/icons-vue', 'ant-design-vue'],
  },
});
