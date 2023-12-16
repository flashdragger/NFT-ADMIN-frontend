<template>
  <a-modal :width="modalWidth" v-model:open="visible" title="添加著作人" :footer="null">
    <Segmented class="mt-4" v-model:value="modelRef.type" :options="options" @change="handleChangeType" />
    <a-divider></a-divider>
    <a-form size="large" :labelCol="{ span: 4 }" class="author-form">
      <a-row :gutter="24" :wrap="true">
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item v-if="modelRef.type === '个人'" label="姓名" v-bind="validateInfos.name">
            <a-input v-model:value="modelRef.name" />
          </a-form-item>
          <a-form-item v-else label="企业名称" v-bind="validateInfos.companyName">
            <a-input v-model:value="modelRef.companyName" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="手机号码" v-bind="validateInfos.phone">
            <a-input v-model:value="modelRef.phone" type="tel" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item v-if="modelRef.type === '个人'" label="身份证号" v-bind="validateInfos.ID">
            <a-input v-model:value="modelRef.ID" />
          </a-form-item>
          <a-form-item v-else label="信用代码" v-bind="validateInfos.license">
            <a-input v-model:value="modelRef.license" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="电子邮箱" v-bind="validateInfos.email">
            <a-input v-model:value="modelRef.email" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="署名情况" v-bind="validateInfos.sign">
            <a-select v-model:value="modelRef.sign" :options="selectOptions" />
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="24" :md="12">
          <div>
            <a-form-item label="户籍地址" v-bind="validateInfos.city">
              <a-cascader v-model:value="modelRef.city" :options="CityList"></a-cascader>
            </a-form-item>
          </div>
        </a-col>
        <a-col :xs="24" :sm="24" :md="{ span: 12, push: 12 }">
          <a-form-item label="详细地址" v-bind="validateInfos.address">
            <a-textarea :rows="4" :auto-szie="true"></a-textarea>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="{ span: 12, pull: 12 }">
          <a-form-item v-if="modelRef.type === '个人'" label="身份件照" :required="true">
            <div class="flex-col space-y-3">
              <Upload @preview="handlePreview" v-model:fileList="modelRef.posImg">
                上传正面照
              </Upload>
              <Upload @preview="handlePreview" v-model:fileList="modelRef.negImg">
                上传反面照
              </Upload>
            </div>
          </a-form-item>
          <a-form-item v-else label="营业执照" :required="true">
            <div class="flex-col space-y-3">
              <Upload @preview="handlePreview" v-model:fileList="modelRef.posImg">
                上传正面照
              </Upload>
              <Upload @preview="handlePreview" v-model:fileList="modelRef.negImg">
                上传反面照
              </Upload>
            </div>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="{ span: 12, push: 6 }">
          <a-button type="primary" size="large" block @click="submit">保存</a-button>
        </a-col>
      </a-row>
    </a-form>
    <a-modal :open="state.previewVisible" :title="state.previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="state.previewImage" />
    </a-modal>
  </a-modal>
</template>
<script setup lang="ts">
import { useModalWidth } from '@/hooks/useModalWidth';
import { Form, Segmented, UploadFile, notification } from "ant-design-vue"
import Upload from "@/components/upload/upload.vue"
import CityList from "@/assets/city.json"
import { getBase64 } from '@/utils/util';

const { useForm } = Form
const { modalWidth } = useModalWidth(978)
const props = defineProps<{ visible: boolean }>()
const emits = defineEmits(['update:visible'])

const visible = computed({
  get: () => props.visible,
  set: val => emits('update:visible', val)
})

const selectOptions = [
  {
    label: '本名',
    value: "本名"
  },
  {
    label: '别名',
    value: "别名"
  },
  {
    label: '个具名',
    value: "个具名"
  }
]
const options = ['个人', '企业']

const modelRef = reactive({
  type: '个人',
  name: "",
  companyName: "",
  phone: '',
  email: '',
  ID: "",
  license: "",
  sign: '',
  city: [],
  address: "",
  posImg: [],
  negImg: []
})

const rulesRef = {
  name: [
    {
      required: true,
      message: "姓名不能为空"
    }
  ],
  companyName: [
    {
      required: true,
      message: "姓名不能为空"
    }
  ],
  phone: [
    {
      required: true,
      message: "手机号码不能为空"
    }
  ],
  ID: [
    {
      required: true,
      message: "身份证号不能为空"
    }
  ],
  license: [
    {
      required: true,
      message: "信用代码不能为空"
    }
  ],
  email: [
    {
      required: true,
      message: "邮箱不能为空"
    },
    {
      type: 'email',
      message: "请正确邮箱格式"
    }
  ],
  sign: [
    {
      required: true,
      message: "署名情况不能为空"
    },
  ],
  city: [
    {
      type: "array",
      required: true,
      message: "户籍地址不能为空"
    }
  ]
}

const { validate, validateInfos, resetFields, clearValidate } = useForm(modelRef, rulesRef)

function handleChangeType() {
  clearValidate()
}
async function submit() {
  const excludeFields = ['license', 'companyName']
  const validateFields = Object.keys(rulesRef)
  if (modelRef.type === '个人') {
    excludeFields.forEach(v => {
      const index = validateFields.findIndex(item => item === v)
      validateFields.splice(index, 1)
    })
  }
  await validate(validateFields)
  notification.success({ message: "添加成功" })
  visible.value = false
}

const state = reactive({
  previewVisible: false,
  previewImage: "",
  previewTitle: ""
})

const handleCancel = () => {
  state.previewVisible = false;
  state.previewTitle = '';
};
const handlePreview = async (file: UploadFile) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  state.previewImage = file.url || file.preview || "";
  state.previewVisible = true;
  state.previewTitle = file.name || file.url?.substring(file.url.lastIndexOf('/') + 1) || '';
};

</script>

<style lang="less">
.author-form {
  .ant-upload-select {
    width: 100% !important;
    height: 200px !important;
  }

  .ant-upload-list-item-container {
    width: 100% !important;
    height: 200px !important;
  }
}
</style>