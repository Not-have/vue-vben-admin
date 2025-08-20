<script setup lang="tsx">
import type { FormItemProp } from 'element-plus';

import type { PropType } from 'vue';

import type { SearchProps } from './types';

import type { FormSchema, FormSetProps } from '#/components/Form';
import type { Recordable } from '#/types';

import { computed, onMounted, ref, unref, watch } from 'vue';

import { cloneDeep, set } from 'lodash-es';

import { Form } from '#/components/Form';
import { initModel } from '#/components/Form/src/helper';
import { useForm } from '#/hooks/web/useForm';
import { findIndex } from '#/utils';
import { isEmptyVal, isObject } from '#/utils/is';
import { propTypes } from '#/utils/propTypes';

import ActionButton from './components/ActionButton.vue';

const props = defineProps({
  // 底部按钮的对齐方式
  buttonPosition: propTypes.string
    .validate((v: string) => ['center', 'left', 'right'].includes(v))
    .def('center'),
  // 伸缩的界限字段
  expandField: propTypes.string.def(''),
  inline: propTypes.bool.def(true),
  // 是否需要栅格布局
  isCol: propTypes.bool.def(false),
  // 表单label宽度
  labelWidth: propTypes.oneOfType([String, Number]).def('auto'),
  // 操作按钮风格位置
  layout: propTypes.string
    .validate((v: string) => ['bottom', 'inline'].includes(v))
    .def('inline'),
  model: {
    default: () => ({}),
    type: Object as PropType<Recordable>,
  },
  // 是否去除空值项
  removeNoValueItem: propTypes.bool.def(true),
  resetLoading: propTypes.bool.def(false),
  // 生成Form的布局结构数组
  schema: {
    default: () => [],
    type: Array as PropType<FormSchema[]>,
  },
  searchLoading: propTypes.bool.def(false),
  // 是否显示伸缩
  showExpand: propTypes.bool.def(false),
  showReset: propTypes.bool.def(true),
  showSearch: propTypes.bool.def(true),
});

const emit = defineEmits(['search', 'reset', 'register', 'validate']);

const visible = ref(true);

// 表单数据
const formModel = ref<Recordable>(props.model);

const newSchema = computed(() => {
  const propsComputed = unref(getProps);
  let schema: FormSchema[] = cloneDeep(propsComputed.schema);
  if (
    propsComputed.showExpand &&
    propsComputed.expandField &&
    !unref(visible)
  ) {
    const index = findIndex(
      schema,
      (v: FormSchema) => v.field === propsComputed.expandField,
    );
    schema.map((v, i) => {
      v.hidden = i >= index;
      return v;
    });
  }
  if (propsComputed.layout === 'inline') {
    schema = [
      ...schema,
      {
        field: 'action',
        formItemProps: {
          labelWidth: '0px',
          slots: {
            default: () => {
              return (
                <div>
                  <ActionButton
                    onExpand={setVisible}
                    onReset={reset}
                    onSearch={search}
                    resetLoading={propsComputed.resetLoading}
                    searchLoading={propsComputed.searchLoading}
                    showExpand={propsComputed.showExpand}
                    showReset={propsComputed.showReset}
                    showSearch={propsComputed.showSearch}
                    visible={visible.value}
                  />
                </div>
              );
            },
            label: () => {
              return <span>&nbsp;</span>;
            },
          },
        },
      },
    ];
  }
  return schema;
});

const { formMethods, formRegister } = useForm();
const { getElFormExpose, getFormData, getFormExpose } = formMethods;

// useSearch传入的props
const outsideProps = ref<SearchProps>({});

const mergeProps = ref<SearchProps>({});

const getProps = computed(() => {
  const propsObj = { ...props };
  Object.assign(propsObj, unref(mergeProps));
  return propsObj;
});

const setProps = (props: SearchProps = {}) => {
  mergeProps.value = Object.assign(unref(mergeProps), props);
  // @ts-ignore
  outsideProps.value = props;
};

const schemaRef = ref<FormSchema[]>([]);

// 监听表单结构化数组，重新生成formModel
watch(
  () => unref(newSchema),
  async (schema = []) => {
    formModel.value = initModel(schema, unref(formModel));
    schemaRef.value = schema;
  },
  {
    deep: true,
    immediate: true,
  },
);

const filterModel = async () => {
  const model = await getFormData();
  if (unref(getProps).removeNoValueItem) {
    // 使用reduce过滤空值，并返回一个新对象
    // eslint-disable-next-line unicorn/no-array-reduce
    return Object.keys(model).reduce((prev: Record<string, any>, next) => {
      const value = model[next];
      if (!isEmptyVal(value)) {
        if (isObject(value)) {
          if (Object.keys(value).length > 0) {
            prev[next] = value;
          }
        } else {
          prev[next] = value;
        }
      }
      return prev;
    }, {});
  }
  return model;
};

const search = async () => {
  const elFormExpose = await getElFormExpose();
  await elFormExpose?.validate(async (isValid) => {
    if (isValid) {
      const model = await filterModel();
      emit('search', model);
    }
  });
};

const reset = async () => {
  const elFormExpose = await getElFormExpose();
  elFormExpose?.resetFields();
  const model = await filterModel();
  emit('reset', model);
};

const bottomButtonStyle = computed(() => {
  return {
    textAlign: unref(getProps).buttonPosition as unknown as
      | 'center'
      | 'left'
      | 'right',
  };
});

const setVisible = async () => {
  visible.value = !unref(visible);
};

const setSchema = (schemaProps: FormSetProps[]) => {
  const { schema } = unref(getProps);
  for (const v of schema) {
    for (const item of schemaProps) {
      if (v.field === item.field) {
        set(v, item.path, item.value);
      }
    }
  }
};

// 对表单赋值
const setValues = async (data: Recordable = {}) => {
  formModel.value = Object.assign(props.model, unref(formModel), data);
  const formExpose = await getFormExpose();
  formExpose?.setValues(data);
};

const delSchema = (field: string) => {
  const { schema } = unref(getProps);

  const index = findIndex(schema, (v: FormSchema) => v.field === field);
  if (index > -1) {
    schema.splice(index, 1);
  }
};

const addSchema = (formSchema: FormSchema, index?: number) => {
  const { schema } = unref(getProps);
  if (index !== void 0) {
    schema.splice(index, 0, formSchema);
    return;
  }
  schema.push(formSchema);
};

const defaultExpose = {
  addSchema,
  delSchema,
  getElFormExpose,
  getFormData,
  setProps,
  setSchema,
  setValues,
};

onMounted(() => {
  emit('register', defaultExpose);
});

defineExpose(defaultExpose);

const onFormValidate = (
  prop: FormItemProp,
  isValid: boolean,
  message: string,
) => {
  emit('validate', prop, isValid, message);
};
</script>

<template>
  <Form
    :model="formModel"
    :is-custom="false"
    :label-width="getProps.labelWidth"
    hide-required-asterisk
    :inline="getProps.inline"
    :is-col="getProps.isCol"
    :schema="schemaRef"
    @register="formRegister"
    @validate="onFormValidate"
  />

  <template v-if="layout === 'bottom'">
    <div :style="bottomButtonStyle">
      <ActionButton
        :show-reset="getProps.showReset"
        :show-search="getProps.showSearch"
        :show-expand="getProps.showExpand"
        :search-loading="getProps.searchLoading"
        :reset-loading="getProps.resetLoading"
        :visible="visible"
        @expand="setVisible"
        @reset="reset"
        @search="search"
      />
    </div>
  </template>
</template>
<style scoped>
:deep(.el-select__wrapper) {
  min-width: 178px;
}
</style>
