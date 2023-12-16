import {
  computed,
  defineComponent,
  getCurrentInstance,
  PropType,
  reactive,
  ref,
  unref,
  watchEffect,
} from 'vue';
import { Col, Form, Row } from 'ant-design-vue';
import { formProps } from 'ant-design-vue/lib/form';
import SchemaFormItem from './schema-form-item.vue';
import type { FormActionType, FormItemSchema, FormSchema } from './types/form';
import { NamePath } from 'ant-design-vue/lib/form/interface';
import { cloneDeep, isArray, isBoolean, isFunction, isObject, merge, uniqBy } from 'lodash';
import { dateItemType, handleInputNumberValue } from './helper';
import dayjs from 'dayjs';
import { createFormContext } from './hooks/useFormContext';
import { isNullOrUnDef } from '@/utils/is';
const { Item } = Form;

const spanTotal = 24;
export default defineComponent({
  name: 'SchemaForm',
  emits: ['submit', 'reset'],
  props: {
    ...formProps,
    formSchema: {
      // 动态验证表单
      type: Object as PropType<FormSchema>,
      default: () => ({}),
    },
    initialValues: {
      // 预置字段默认值
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
  },
  setup(props, { attrs, emit, slots, expose }) {
    // provide schemaForm instance
    createFormContext(getCurrentInstance()!);
    let oldFormSchema: FormSchema;
    const formSchemaRef = ref<FormSchema>(cloneDeep(props.formSchema));
    // 表单项数据
    const formModel = reactive({ ...props.initialValues });
    // 表单默认数据
    const defaultFormValues = reactive({ ...props.initialValues });
    // 表单实例
    const schemaFormRef = ref<FormActionType>();
    // 表单属性
    const schemaFormPropsRef = ref<Partial<FormSchema>>({});
    // 缓存的表单值，用于恢复form-item v-if为true后的值
    const cacheFormModel = { ...props.initialValues };
    // 将所有的表单组件实例保存起来
    const compRefs = {} as any;

    // 获取表单所有属性
    const getFormProps = computed(() => {
      return {
        ...attrs,
        ...props,
        ...formSchemaRef.value,
      } as FormSchema;
    });

    watchEffect(() => {
      if (Object.is(props.formSchema, oldFormSchema)) {
        merge(formSchemaRef.value, cloneDeep(props.formSchema));
      } else {
        formSchemaRef.value = cloneDeep(props.formSchema);
      }
      oldFormSchema = props.formSchema;
    });

    // 初始化数据
    unref(formSchemaRef)?.schemas?.forEach(item => {
      const { defaultValue } = item;
      if (!isNullOrUnDef(defaultValue)) {
        //@ts-ignore
        formModel[item.field] = defaultValue;
        //@ts-ignore
        defaultFormValues[item.field] = defaultValue;
        //@ts-ignore
        cacheFormModel[item.field] = defaultValue;
      }
    });
    // 将所有的表单组件实例保存起来
    const setItemRef = (formItem: FormItemSchema) => {
      return (el: any) => {
        if (el) {
          compRefs[formItem.field] = el;
        }
      };
    };

    const getFormItemIsShow = (formItem: FormItemSchema, key: 'vIf' | 'vShow') => {
      if (Reflect.has(formItem, key)) {
        const isShow = formItem[key];
        let show = true;
        if (isBoolean(isShow)) {
          show = isShow;
        }
        if (isFunction(isShow)) {
          show = isShow({ schemaItem: formItem, formModel, field: formItem.field });
        }
        if (Object.is(show, false) && key === 'vIf') {
          formModel[formItem.field] = undefined;
        } else if (Object.is(show, true) && key === 'vIf') {
          formModel[formItem.field] = cacheFormModel[formItem.field];
        }
        return show;
      } else {
        return true;
      }
    };

    // 设置表单属性
    const setFormProps = (formProps: Partial<FormSchema>) => {
      Object.assign(schemaFormPropsRef.value, formProps);
    };

    // 设置某个字段的值
    const setFormModel = (key: string, value: any) => {
      formModel[key] = value;
      cacheFormModel[key] = value;
      const { validateTrigger } = unref(getFormProps);
      if (!validateTrigger || validateTrigger === 'change') {
        schemaFormRef.value?.validateFields([key]).catch(_ => {});
      }
    };
    // 获取栅栏Row配置
    const getRowConfig = computed((): Recordable => {
      const { baseRowStyle = {}, rowProps } = unref(getFormProps);
      return {
        style: baseRowStyle,
        ...rowProps,
      };
    });

    /**
     * @description: Is it time
     */
    function itemIsDateType(key: string) {
      return unref(formSchemaRef)?.schemas.some(item => {
        return item.field === key ? dateItemType.includes(item.component as string) : false;
      });
    }

    /**
     * @description: Set form value
     */
    async function setFieldsValue(values: Recordable): Promise<void> {
      const schemas = unref(formSchemaRef)?.schemas;
      const fields = schemas?.map(item => item.field).filter(Boolean);

      Object.assign(cacheFormModel, values);

      const validKeys: string[] = [];
      Object.keys(values).forEach(key => {
        const schema = schemas?.find(item => item.field === key);
        let value = values[key];

        const hasKey = Reflect.has(values, key);
        //@ts-ignore
        value = handleInputNumberValue(schema?.component, value);
        // 0| '' is allow
        if (hasKey && fields?.includes(key)) {
          // time type
          if (itemIsDateType(key)) {
            if (Array.isArray(value)) {
              const arr: any[] = [];
              for (const ele of value) {
                arr.push(ele ? dayjs(ele) : null);
              }
              formModel[key] = arr;
            } else {
              const { componentProps } = schema || {};
              let _props = componentProps as any;
              if (typeof componentProps === 'function') {
                _props = _props({ formModel });
              }
              formModel[key] = value ? (_props?.valueFormat ? value : dayjs(value)) : null;
            }
          } else {
            formModel[key] = value;
          }
          validKeys.push(key);
        }
      });
      validateFields(validKeys).catch(_ => {});
    }

    async function resetSchema(data: Partial<FormItemSchema> | Partial<FormItemSchema>[]) {
      let updateData: Partial<FormItemSchema>[] = [];
      if (isObject(data)) {
        updateData.push(data as FormItemSchema);
      }
      if (isArray(data)) {
        updateData = [...data];
      }

      // @ts-ignore
      unref(formSchemaRef).schemas = updateData as FormItemSchema[];
    }

    /**
     * @description  更新formItemSchema
     */
    async function updateSchema(data: Partial<FormItemSchema> | Partial<FormItemSchema>[]) {
      let updateData: Partial<FormItemSchema>[] = [];
      if (isObject(data)) {
        updateData.push(data as FormItemSchema);
      }
      if (isArray(data)) {
        updateData = [...data];
      }

      const hasField = updateData.every(
        item => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field),
      );

      if (!hasField) {
        console.error(
          'All children of the form Schema array that need to be updated must contain the `field` field',
        );
        return;
      }
      const schema: FormItemSchema[] = [];
      updateData.forEach(item => {
        unref(formSchemaRef)?.schemas.forEach(val => {
          if (val.field === item.field) {
            const newSchema = merge(val, item);
            //@ts-ignore
            schema.push(newSchema);
          } else {
            schema.push(val);
          }
        });
      });
      //@ts-ignore
      unref(formSchemaRef).schemas = uniqBy(schema, 'field');
    }

    async function resetFields(): Promise<void> {
      const { resetFunc, submitOnReset } = unref(getFormProps);
      resetFunc && isFunction(resetFunc) && (await resetFunc());

      Object.keys(formModel).forEach(key => {
        formModel[key] = defaultFormValues[key];
      });

      emit('reset', formModel);
      submitOnReset && handleSubmit();
      setTimeout(clearValidate);
    }

    async function validateFields(nameList?: NamePath[] | undefined) {
      return schemaFormRef.value?.validateFields(nameList);
    }

    async function validate(nameList?: NamePath[] | undefined) {
      await schemaFormRef.value?.validate(nameList);
      return formModel;
    }

    async function clearValidate(name?: string | string[]) {
      await schemaFormRef.value?.clearValidate(name);
    }

    async function scrollToField(name: NamePath, options?: ScrollOptions | undefined) {
      await schemaFormRef.value?.scrollToField(name, options);
    }

    const handleSubmit = () => {
      emit('submit');
    };

    const slot = (list: {}) => {
      const json = {} as any;
      Object.keys(list).forEach(item => {
        json[item] = (data: any) => slots.item && slots.item(data);
      });
    };

    const calcSubBtnOffset = computed(() => {
      let total = 0;
      formSchemaRef?.value?.schemas.forEach(v => {
        total += v.colProps?.span as number;
      });
      if (total === 24) {
        return 24;
      } else if (total < 24) {
        return spanTotal - total;
      } else if (total > 24) {
        return spanTotal - ((total - spanTotal) % spanTotal);
      }
    });

    return {
      schemaFormRef,
      schemaFormPropsRef,
      getFormProps,
      formModel,
      formSchemaRef,
      getRowConfig,
      compRefs,
      calcSubBtnOffset,
      setItemRef,
      getFormItemIsShow,
      resetFields,
      setFieldsValue,
      setFormProps,
      setFormModel,
      validateFields,
      resetSchema,
      updateSchema,
      validate,
      clearValidate,
      scrollToField,
      slot,
    };
  },
  render() {
    return (
      <Form ref="schemaFormRef" {...this.getFormProps} model={this.formModel}>
        <Row {...this.getRowConfig}>
          {this.formSchemaRef?.schemas.map(schemaItem => {
            if (
              this.getFormItemIsShow(schemaItem, 'vIf') &&
              this.getFormItemIsShow(schemaItem, 'vShow')
            )
              return (
                //@ts-ignore
                <SchemaFormItem
                  key={schemaItem.field}
                  schemaItem={schemaItem}
                  schema={this.formSchemaRef}
                  setFormModel={this.setFormModel}
                  formModel={this.formModel}
                  setItemRef={this.setItemRef(schemaItem)}
                >
                  {this.slot(this.$slots)}
                </SchemaFormItem>
              );
          })}
          {this.$slots['operate-button'] && (
            <Col span={this.calcSubBtnOffset}>
              <Item class="operate-button">{this.$slots['operate-button']()}</Item>
            </Col>
          )}
        </Row>
      </Form>
    );
  },
});
