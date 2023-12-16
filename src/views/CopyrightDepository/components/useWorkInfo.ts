import { Form } from 'ant-design-vue';
import { RuleObject } from 'ant-design-vue/lib/form';
import dayjs from 'dayjs';

export const useWorkInfo = () => {
  const time = dayjs();
  const modelRef = reactive({
    //作品类型
    workType: '文学作品',
    //作品完成时间
    workCompleteTime: time,
    //作品完成地点
    workCompletePlace: '上海市黄浦区',
    //作品发表状态
    publicationStatus: '已发表',
    //权利取得方式
    entitlementOfMethod: '继承',
    //权利归属方式
    attributionOfRights: '个人作品',
    //作品创作性质
    creativeNature: '改编',
    //是否允许公示
    isPublic: '是',
  });

  const ruleRef: Recordable<RuleObject[]> = {
    workType: [
      {
        required: true,
        message: '作品类型不能为空',
      },
    ],
    workCompleteTime: [
      {
        required: true,
        message: '作品类型不能为空',
      },
    ],
    workCompletePlace: [
      {
        required: true,
        message: '作品类型不能为空',
      },
    ],
    publicationStatus: [
      {
        required: true,
        message: '作品发表状态不能为空',
      },
    ],
    entitlementOfMethod: [
      {
        required: true,
        message: '权利取得方式不能为空',
      },
    ],
    attributionOfRights: [
      {
        required: true,
        message: '权利归属方式不能为空',
      },
    ],
    creativeNature: [
      {
        required: true,
        message: '作品创作性质不能为空',
      },
    ],
  };
  const { useForm } = Form;
  const { validate, validateInfos, clearValidate, resetFields } = useForm(modelRef, ruleRef);

  return {
    ...toRefs(modelRef),
    modelRef,
    validateInfos,
    validate,
    clearValidate,
    resetFields,
  };
};

export const workTypeOpts = [
  {
    label: '文字作品',
    value: '文字作品',
  },
  {
    label: '口述作品',
    value: '口述作品',
  },
  {
    label: '摄影作品',
    value: '摄影作品',
  },
  {
    label: '音乐作品',
    value: '音乐作品',
  },
  {
    label: '其他',
    value: '其他',
  },
];

export const publicationStatusOpts = [
  {
    label: '未发表',
    value: '未发表',
  },
  {
    label: '已发表',
    value: '已发表',
  },
];

export const entitlementOfMethodOpts = [
  {
    label: '原始',
    value: '原始',
  },
  {
    label: '继承',
    value: '继承',
  },
  {
    label: '转让',
    value: '转让',
  },
];

export const creativeNatureOpts = [
  {
    label: '原创',
    value: '原创',
  },
  {
    label: '改编',
    value: '改编',
  },
  {
    label: '翻译',
    value: '翻译',
  },
  {
    label: '注释',
    value: '注释',
  },
  {
    label: '整理',
    value: '整理',
  },
];

export const attributionOfRightsOpts = [
  {
    label: '个人作品',
    value: '个人作品',
  },
  {
    label: '集体作品',
    value: '集体作品',
  },
];

export const publicOpts = [
  {
    label: ' 是',
    value: '是',
  },
  { label: '否', value: '否' },
];

export const ownershipOpts = [
  '发表权',
  '署名权',
  '修改权',
  '保护作品完整权',
  '复制权',
  '发行权',
  '展览权',
  '出租权',
  '表演权',
  '放映权',
  '⼴播权',
  '信息⽹络传播权',
  '摄制权',
  '改编权',
  '制译权',
  '其他',
];
