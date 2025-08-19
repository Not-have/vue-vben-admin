<script lang="tsx">
import type { PropType } from 'vue';

import type { DescriptionsSchema } from './types';

import { computed, defineComponent, ref, unref } from 'vue';

import { usePreferences } from '@vben/preferences';

import { ElCol, ElCollapseTransition, ElRow, ElTooltip } from 'element-plus';
import { get } from 'lodash-es';

import { Icon } from '#/components/Icon';
import { propTypes } from '#/utils/propTypes';

const mobile = computed(() => usePreferences().isMobile);

const defaultData = '-';

export default defineComponent({
  name: 'Descriptions',
  props: {
    border: propTypes.bool.def(true),
    collapse: propTypes.bool.def(true),
    column: propTypes.number.def(2),
    data: {
      default: () => ({}),
      type: Object as PropType<any>,
    },
    direction: propTypes.oneOf(['horizontal', 'vertical']).def('horizontal'),
    extra: propTypes.string.def(''),
    message: propTypes.string.def(''),
    schema: {
      default: () => [],
      type: Array as PropType<DescriptionsSchema[]>,
    },
    size: propTypes.oneOf(['large', 'default', 'small']).def('default'),
    title: propTypes.string.def(''),
  },
  setup(props, { attrs }) {
    const getBindValue = computed((): any => {
      // eslint-disable-next-line unicorn/prefer-set-has
      const delArr: string[] = [
        'title',
        'message',
        'collapse',
        'schema',
        'data',
        'class',
      ];
      const obj = { ...attrs, ...props };
      for (const key in obj) {
        if (delArr.includes(key)) {
          delete obj[key as keyof typeof obj];
        }
      }
      if (unref(mobile)) {
        obj.direction = 'vertical';
      }
      return obj;
    });

    const getBindItemValue = (item: DescriptionsSchema) => {
      // eslint-disable-next-line unicorn/prefer-set-has
      const delArr: string[] = ['field'];
      const obj = { ...item };
      for (const key in obj) {
        if (delArr.includes(key)) {
          delete obj[key as keyof typeof obj];
        }
      }
      return {
        labelClassName: `descriptions-label`,
        ...obj,
      };
    };

    // 折叠
    const show = ref(true);

    const toggleClick = () => {
      if (props.collapse) {
        show.value = !unref(show);
      }
    };

    return () => {
      return (
        <div
          class={[
            'descriptions',
            'dark:border-1px bg-[var(--el-color-white)] dark:border-[var(--el-border-color)] dark:bg-[var(--el-bg-color)]',
          ]}
        >
          {props.title ? (
            <div
              class={[
                `descriptions-header`,
                'h-50px layout-border__bottom px-10px relative flex cursor-pointer items-center justify-between',
              ]}
              onClick={toggleClick}
            >
              <div
                class={[
                  `descriptions-header__title`,
                  'font-18px ml-10px relative font-bold',
                ]}
              >
                <div class="flex items-center">
                  {props.title}
                  {props.message ? (
                    <ElTooltip content={props.message} placement="right">
                      <Icon
                        class="ml-5px"
                        icon="bi:question-circle-fill"
                        size={14}
                      />
                    </ElTooltip>
                  ) : null}
                </div>
              </div>
              {props.collapse ? (
                <Icon icon={show.value ? 'ep:arrow-down' : 'ep:arrow-up'} />
              ) : null}
            </div>
          ) : null}

          <ElCollapseTransition>
            <div
              class={[`descriptions-content`, 'p-20px']}
              v-show={unref(show)}
            >
              <ElRow
                gutter={0}
                {...unref(getBindValue)}
                class="outline-1px outline-solid outline-[var(--el-border-color-lighter)]"
              >
                {props.schema.map((item) => {
                  return (
                    <ElCol
                      class="flex items-stretch"
                      key={item.field}
                      span={item.span || 24 / props.column}
                    >
                      {props.direction === 'horizontal' ? (
                        <div class="outline-1px outline-solid flex flex-1 items-stretch bg-[var(--el-fill-color-light)] outline-[var(--el-border-color-lighter)]">
                          <div
                            {...getBindItemValue(item)}
                            class="w-120px px-8px py-11px font-700 color-[var(--el-text-color-regular)] border-r-1px border-r-solid border-r-[var(--el-border-color-lighter)] text-left"
                          >
                            {item.label}
                          </div>
                          <div class="px-8px py-11px color-[var(--el-text-color-primary)] text-size-14px flex-1 bg-[var(--el-bg-color)]">
                            {item.slots?.default
                              ? item.slots?.default(props.data)
                              : (get(props.data, item.field) ?? defaultData)}
                          </div>
                        </div>
                      ) : (
                        <div class="outline-1px outline-solid flex-1 bg-[var(--el-fill-color-light)] outline-[var(--el-border-color-lighter)]">
                          <div
                            {...getBindItemValue(item)}
                            class="px-8px py-11px font-700 color-[var(--el-text-color-regular)] border-b-1px border-b-solid border-b-[var(--el-border-color-lighter)] text-left"
                          >
                            {item.label}
                          </div>
                          <div class="px-8px py-11px color-[var(--el-text-color-primary)] text-size-14px flex-1 bg-[var(--el-bg-color)]">
                            {item.slots?.default
                              ? item.slots?.default(props.data)
                              : (get(props.data, item.field) ?? defaultData)}
                          </div>
                        </div>
                      )}
                    </ElCol>
                  );
                })}
              </ElRow>
            </div>
          </ElCollapseTransition>
        </div>
      );
    };
  },
});
</script>

<style lang="less" scoped>
:deep(.el-descriptions__header) {
  display: none !important;
}

.descriptions-header {
  &__title {
    &::after {
      position: absolute;
      top: 3px;
      left: -10px;
      width: 4px;
      height: 70%;
      background: var(--el-color-primary);
      content: '';
    }
  }
}

:deep(.descriptions-label) {
  width: 150px !important;
}
</style>
