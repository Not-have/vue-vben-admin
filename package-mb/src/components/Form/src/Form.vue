<script lang="tsx">
import type { ComponentSize, FormRules } from 'element-plus';

import type { PropType } from 'vue';

import type {
  CheckboxGroupComponentProps,
  ComponentName,
  FormProps,
  FormSchema,
  FormSetProps,
  RadioGroupComponentProps,
  SelectComponentProps,
} from './types';

import type { ComponentRef, Recordable } from '#/types';

import { computed, defineComponent, onMounted, ref, unref, watch } from 'vue';

import {
  ElCol,
  ElForm,
  ElFormItem,
  ElRow,

  // FormItemProp
} from 'element-plus';
import { get, set } from 'lodash-es';

import { findIndex } from '#/utils';
import { propTypes } from '#/utils/propTypes';
import { getSlot } from '#/utils/tsxHelper';

import { useRenderCheckbox } from './components/useRenderCheckbox';
import { useRenderRadio } from './components/useRenderRadio';
import { useRenderSelect } from './components/useRenderSelect';
import {
  initModel,
  setComponentProps,
  setGridProp,
  setItemComponentSlots,
  setTextPlaceholder,
} from './helper';
import { componentMap } from './helper/componentMap';
import { ComponentNameEnum } from './types';

const { renderSelectOptions } = useRenderSelect();
const { renderRadioOptions } = useRenderRadio();
const { renderCheckboxOptions } = useRenderCheckbox();

export default defineComponent({
  emits: ['register'],
  name: 'Form',
  props: {
    // 是否自动设置placeholder
    autoSetPlaceholder: propTypes.bool.def(true),
    disabled: propTypes.bool.def(false),
    hideRequiredAsterisk: propTypes.bool.def(false),
    inlineMessage: propTypes.bool.def(false),
    // 是否需要栅格布局
    isCol: propTypes.bool.def(true),
    // 是否自定义内容
    isCustom: propTypes.bool.def(false),
    labelPosition: propTypes.oneOf(['left', 'right', 'top']).def('right'),
    labelSuffix: propTypes.string.def(''),
    // 表单label宽度
    labelWidth: propTypes.oneOfType([String, Number]).def('auto'),
    // 表单数据对象
    model: {
      default: () => ({}),
      type: Object as PropType<any>,
    },
    requireAsteriskPosition: propTypes.oneOf(['left', 'right']).def('left'),
    rules: {
      default: () => ({}),
      type: Object as PropType<FormRules>,
    },
    // 生成Form的布局结构数组
    schema: {
      default: () => [],
      type: Array as PropType<FormSchema[]>,
    },
    scrollToError: propTypes.bool.def(false),
    scrollToErrorOffset: propTypes.oneOfType([Boolean, Object]).def(undefined),
    showMessage: propTypes.bool.def(true),
    size: {
      default: undefined,
      type: String as PropType<ComponentSize>,
    },
    statusIcon: propTypes.bool.def(false),
    validateOnRuleChange: propTypes.bool.def(true),
    // onValidate: {
    //   type: Function as PropType<(prop: FormItemProp, isValid: boolean, message: string) => void>,
    //   default: () => {}
    // }
  },
  setup(props, { emit, expose, slots }) {
    // element form 实例
    const elFormRef = ref<ComponentRef<typeof ElForm>>();

    const mergeProps = ref<FormProps>({});

    const getProps = computed(() => {
      const propsObj = { ...props };
      Object.assign(propsObj, unref(mergeProps));
      return propsObj;
    });

    // 存储表单实例
    const formComponents = ref<Recordable>({});

    // 存储form-item实例
    const formItemComponents = ref<Recordable>({});

    // 表单数据
    const formModel = ref<Recordable>(props.model);

    onMounted(() => {
      emit('register', unref(elFormRef)?.$parent, unref(elFormRef));
    });

    // 对表单赋值
    const setValues = (data: Recordable = {}) => {
      formModel.value = Object.assign(unref(formModel), data);
    };

    const setProps = (props: FormProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props);
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

    const getOptions = async (fn: Function, item: FormSchema) => {
      const options = await fn();
      if (!options || options.length === 0) return;
      setSchema([
        {
          field: item.field,
          path:
            item.component === ComponentNameEnum.TREE_SELECT ||
            item.component === ComponentNameEnum.TRANSFER
              ? 'componentProps.data'
              : 'componentProps.options',
          value: options,
        },
      ]);
    };

    /**
     * @description: 获取表单组件实例
     * @param filed 表单字段
     */
    const getComponentExpose = (filed: string) => {
      return unref(formComponents)[filed];
    };

    /**
     * @description: 获取formItem实例
     * @param filed 表单字段
     */
    const getFormItemExpose = (filed: string) => {
      return unref(formItemComponents)[filed];
    };

    const setComponentRefMap = (ref: any, filed: string) => {
      formComponents.value[filed] = ref;
    };

    const setFormItemRefMap = (ref: any, filed: string) => {
      formItemComponents.value[filed] = ref;
    };

    expose({
      addSchema,
      delSchema,
      formModel,
      getComponentExpose,
      getFormItemExpose,
      setProps,
      setSchema,
      setValues,
    });

    // 监听表单结构化数组，重新生成formModel
    watch(
      () => unref(getProps).schema,
      (schema = []) => {
        // @ts-ignore
        formModel.value = initModel(schema, unref(formModel));
      },
      {
        deep: true,
        immediate: true,
      },
    );

    // 渲染包裹标签，是否使用栅格布局
    const renderWrap = () => {
      const { isCol } = unref(getProps);
      const content = isCol ? (
        <ElRow gutter={20}>{renderFormItemWrap()}</ElRow>
      ) : (
        renderFormItemWrap()
      );
      return content;
    };

    // 是否要渲染el-col
    const renderFormItemWrap = () => {
      // hidden属性表示隐藏，不做渲染
      const { isCol, schema = [] } = unref(getProps);

      return schema
        .filter((v) => !v.remove)
        .map((item) => {
          // 如果是 Divider 组件，需要自己占用一行
          const isDivider = item.component === 'Divider';
          const Com = componentMap.Divider as ReturnType<
            typeof defineComponent
          >;
          return isDivider ? (
            <Com {...{ contentPosition: 'left', ...item.componentProps }}>
              {item?.label}
            </Com>
          ) : // eslint-disable-next-line unicorn/no-nested-ternary
          isCol ? (
            // 如果需要栅格，需要包裹 ElCol
            <ElCol {...setGridProp(item.colProps)}>
              {renderFormItem(item)}
            </ElCol>
          ) : (
            renderFormItem(item)
          );
        });
    };

    // 渲染formItem
    const renderFormItem = (item: FormSchema) => {
      // 如果有optionApi，优先使用optionApi, 并且options不存在或者为空数组
      if (
        item.optionApi &&
        (!item.componentProps?.options || !item.componentProps?.options.length)
      ) {
        // 内部自动调用接口，不影响其它渲染
        getOptions(item.optionApi, item);
      }
      const formItemSlots: Recordable = {
        default: () => {
          if (item?.formItemProps?.slots?.default) {
            return item?.formItemProps?.slots?.default(formModel.value);
          } else {
            const Com = componentMap[
              item.component as ComponentName
            ] as ReturnType<typeof defineComponent>;

            const { autoSetPlaceholder } = unref(getProps);

            const componentSlots = (item?.componentProps as any)?.slots || {};
            const slotsMap: Recordable = {
              ...setItemComponentSlots(componentSlots),
            };
            // // 如果是select组件，并且没有自定义模板，自动渲染options
            if (item.component === ComponentNameEnum.SELECT) {
              slotsMap.default = componentSlots.default
                ? () => {
                    return componentSlots.default(
                      unref(
                        (item?.componentProps as SelectComponentProps)?.options,
                      ),
                    );
                  }
                : () => renderSelectOptions(item);
            }

            // 虚拟列表
            if (
              item.component === ComponentNameEnum.SELECT_V2 &&
              componentSlots.default
            ) {
              slotsMap.default = ({ item }: { item: FormSchema }) => {
                return componentSlots.default(item);
              };
            }

            // 单选框组和按钮样式
            if (
              item.component === ComponentNameEnum.RADIO_GROUP ||
              item.component === ComponentNameEnum.RADIO_BUTTON
            ) {
              slotsMap.default = componentSlots.default
                ? () => {
                    return componentSlots.default(
                      unref(
                        (item?.componentProps as CheckboxGroupComponentProps)
                          ?.options,
                      ),
                    );
                  }
                : () => renderRadioOptions(item);
            }

            // 多选框组和按钮样式
            if (
              item.component === ComponentNameEnum.CHECKBOX_GROUP ||
              item.component === ComponentNameEnum.CHECKBOX_BUTTON
            ) {
              slotsMap.default = componentSlots.default
                ? () => {
                    return componentSlots.default(
                      unref(
                        (item?.componentProps as RadioGroupComponentProps)
                          ?.options,
                      ),
                    );
                  }
                : () => renderCheckboxOptions(item);
            }

            const Comp = () => {
              // 如果field是多层路径，需要转换成对象
              const itemVal = computed({
                get: () => {
                  return get(formModel.value, item.field);
                },
                set: (val) => {
                  set(formModel.value, item.field, val);
                },
              });

              return item.component === ComponentNameEnum.UPLOAD ? (
                <Com
                  ref={(el: any) => setComponentRefMap(el, item.field)}
                  vModel:file-list={itemVal.value}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...setComponentProps(item)}
                  style={
                    item.componentProps?.style || {
                      width: '100%',
                    }
                  }
                >
                  {{ ...slotsMap }}
                </Com>
              ) : (
                <Com
                  ref={(el: any) => setComponentRefMap(el, item.field)}
                  vModel={itemVal.value}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...setComponentProps(item)}
                  style={
                    item.componentProps?.style || {
                      width: '100%',
                    }
                  }
                >
                  {{ ...slotsMap }}
                </Com>
              );
            };

            return <>{Comp()}</>;
          }
        },
      };
      if (item?.formItemProps?.slots?.label) {
        formItemSlots.label = (...args: any[]) => {
          return (item?.formItemProps?.slots as any)?.label(...args);
        };
      }
      if (item?.formItemProps?.slots?.error) {
        formItemSlots.error = (...args: any[]) => {
          return (item?.formItemProps?.slots as any)?.error(...args);
        };
      }
      return (
        <ElFormItem
          ref={(el: any) => setFormItemRefMap(el, item.field)}
          v-show={!item.hidden}
          {...(item.formItemProps || {})}
          label={item.label || ''}
          prop={item.field}
        >
          {formItemSlots}
        </ElFormItem>
      );
    };

    // 过滤传入Form组件的属性
    const getFormBindValue = () => {
      // 避免在标签上出现多余的属性
      const delKeys = new Set([
        'autoSetPlaceholder',
        'isCol',
        'isCustom',
        'model',
        'schema',
      ]);
      const props = { ...unref(getProps) };
      for (const key in props) {
        if (delKeys.has(key)) {
          delete props[key as keyof typeof props];
        }
      }
      return props as FormProps;
    };

    return () => (
      <ElForm
        ref={elFormRef}
        {...getFormBindValue()}
        class="form"
        model={unref(getProps).isCustom ? unref(getProps).model : formModel}
        // @ts-ignore
        onSubmit={(e: Event) => {
          e.preventDefault();
        }}
      >
        {{
          // 如果需要自定义，就什么都不渲染，而是提供默认插槽
          default: () => {
            const { isCustom } = unref(getProps);
            return isCustom ? getSlot(slots, 'default') : renderWrap();
          },
        }}
      </ElForm>
    );
  },
});
</script>

<style lang="less" scoped>
.el-form.form .el-row {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

.el-form--inline .el-input {
  width: 245px;
}
</style>
