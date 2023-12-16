export const iconUrl = '/iconfont.js';
export default {
  navTheme: 'dark', // theme for nav menu
  primaryColor: '#1890ff', // '#F5222D', // primary color of ant design
  layout: 'side', // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fluid', // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: true, // sticky header
  fixSiderbar: true, // sticky siderbar
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'NFT Admin',
  pwa: false,
  iconfontUrl: iconUrl,
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
};
