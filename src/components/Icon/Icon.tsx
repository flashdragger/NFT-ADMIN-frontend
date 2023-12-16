import { iconUrl } from '@/config/defaultSettings';
import { createFromIconfontCN } from '@ant-design/icons-vue';

const IconFont = createFromIconfontCN({
  scriptUrl: iconUrl,
});
export default defineComponent({
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
  render() {
    return <IconFont type={this.icon} {...this.$attrs}></IconFont>;
  },
});
