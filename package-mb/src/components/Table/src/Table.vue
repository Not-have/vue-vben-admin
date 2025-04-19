<!-- eslint-disable vue/require-default-prop -->
<!-- eslint-disable vue/order-in-components -->
<!-- eslint-disable unicorn/prefer-logical-operator-over-ternary -->
<!-- eslint-disable unicorn/no-nested-ternary -->
<script lang="tsx">
import type { ComponentSize, ElTooltipProps } from 'element-plus';

import type { CSSProperties, PropType } from 'vue';

import type {
  Pagination,
  TableColumn,
  TableProps,
  TableSetProps,
  TableSlotType,
} from './types';

import type { ComponentRef, Recordable } from '#/types';

import { computed, defineComponent, onMounted, ref, unref, watch } from 'vue';

import {
  ElCard,
  ElEmpty,
  ElImage,
  ElPagination,
  ElTable,
  ElTableColumn,
} from 'element-plus';
import { get, set } from 'lodash-es';

import { BaseButton } from '#/components/Button';
import { Icon } from '#/components/Icon';
import { createVideoViewer } from '#/components/VideoPlayer';
import { propTypes } from '#/utils/propTypes';
import { getSlot } from '#/utils/tsxHelper';

import TableActions from './components/TableActions.vue';
import { setIndex } from './helper';

export default defineComponent({
  emits: ['update:pageSize', 'update:currentPage', 'register', 'refresh'],
  name: 'Table',
  props: {
    // 对齐方式
    align: propTypes.string
      .validate((v: string) => ['center', 'left', 'right'].includes(v))
      .def('left'),
    border: propTypes.bool.def(true),
    cardBodyClass: {
      default: '',
      type: String as PropType<string>,
    },
    cardBodyStyle: {
      default: () => ({}),
      type: Object as PropType<CSSProperties>,
    },
    cardWrapClass: {
      default: '',
      type: String as PropType<string>,
    },
    cardWrapStyle: {
      default: () => ({}),
      type: Object as PropType<CSSProperties>,
    },
    cellClassName: {
      default: '',
      type: [Function, String] as PropType<
        (row: Recordable, column: any, rowIndex: number) => string | string
      >,
    },
    cellStyle: {
      default: undefined,
      type: [Function, Object] as PropType<
        (
          row: Recordable,
          column: any,
          rowIndex: number,
        ) => CSSProperties | Recordable
      >,
    },
    // 表头
    columns: {
      default: () => [],
      type: Array as PropType<TableColumn[]>,
    },
    currentPage: propTypes.number.def(1),
    currentRowKey: propTypes.oneOfType([Number, String]),
    // 自定义内容
    customContent: propTypes.bool.def(false),
    data: {
      default: () => [],
      type: Array as PropType<Recordable[]>,
    },
    defaultExpandAll: propTypes.bool.def(false),
    defaultSort: {
      default: () => ({}),
      type: Object as PropType<{ order: string; prop: string }>,
    },
    emptyText: propTypes.string.def('No Data'),
    expandRowKeys: {
      default: undefined,
      type: Array as PropType<string[]>,
    },
    fit: propTypes.bool.def(true),
    flexible: propTypes.bool.def(false),
    // 表头对齐方式
    headerAlign: propTypes.string
      .validate((v: string) => ['center', 'left', 'right'].includes(v))
      .def('left'),
    headerCellClassName: {
      default: '',
      type: [Function, String] as PropType<
        (row: Recordable, column: any, rowIndex: number) => string | string
      >,
    },
    headerCellStyle: {
      default: undefined,
      type: [Function, Object] as PropType<
        (
          row: Recordable,
          column: any,
          rowIndex: number,
        ) => CSSProperties | Recordable
      >,
    },
    headerRowClassName: {
      default: '',
      type: [Function, String] as PropType<
        (row: Recordable, rowIndex: number) => string | string
      >,
    },
    headerRowStyle: {
      default: undefined,
      type: [Function, Object] as PropType<
        (row: Recordable, rowIndex: number) => CSSProperties | Recordable
      >,
    },
    height: propTypes.oneOfType([Number, String]),
    highlightCurrentRow: propTypes.bool.def(false),
    // 图片自动预览字段数组
    imagePreview: {
      default: () => [],
      type: Array as PropType<string[]>,
    },
    indent: propTypes.number.def(16),
    lazy: propTypes.bool.def(false),
    load: {
      default: undefined,
      type: Function as PropType<
        (row: Recordable, treeNode: any, resolve: Function) => void
      >,
    },
    // 加载状态
    loading: propTypes.bool.def(false),
    maxHeight: propTypes.oneOfType([Number, String]),
    pageSize: propTypes.number.def(10),
    // 是否展示分页
    pagination: {
      default: (): Pagination | undefined => undefined,
      type: Object as PropType<Pagination>,
    },
    // 是否叠加索引
    reserveIndex: propTypes.bool.def(false),
    // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
    reserveSelection: propTypes.bool.def(false),
    // row-class-name, 类型为 (row: Recordable, rowIndex: number) => string | string
    rowClassName: {
      default: '',
      type: [Function, String] as PropType<
        (row: Recordable, rowIndex: number) => string | string
      >,
    },
    rowKey: propTypes.string.def('id'),
    rowStyle: {
      default: undefined,
      type: [Function, Object] as PropType<
        (row: Recordable, rowIndex: number) => CSSProperties | Recordable
      >,
    },
    scrollbarAlwaysOn: propTypes.bool.def(false),
    selectOnIndeterminate: propTypes.bool.def(true),
    // 是否展示表格的工具栏
    showAction: propTypes.bool.def(false),
    showHeader: propTypes.bool.def(true),
    // 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip,
    showOverflowTooltip: propTypes.bool.def(true),
    showSummary: propTypes.bool.def(false),
    size: {
      type: String as PropType<ComponentSize>,
      validator: (v: ComponentSize) =>
        ['default', 'large', 'small'].includes(v),
    },
    spanMethod: {
      default: undefined,
      type: Function as PropType<
        (param: {
          column: any;
          columnIndex: number;
          row: any;
          rowIndex: number;
        }) => any[]
      >,
    },
    stripe: propTypes.bool.def(false),
    summaryMethod: {
      default: undefined,
      type: Function as PropType<
        (param: { columns: any[]; data: any[] }) => any[]
      >,
    },
    sumText: propTypes.string.def('Sum'),
    tableLayout: {
      default: 'fixed',
      type: String as PropType<'auto' | 'fixed'>,
    },
    tooltipEffect: {
      default: 'dark',
      type: String as PropType<'dark' | 'light'>,
    },
    tooltipOptions: {
      default: () => ({
        enterable: true,
        hideAfter: 200,
        placement: 'top',
        popperOptions: { strategy: 'fixed' },
        showArrow: true,
      }),
      type: Object as PropType<
        Pick<
          ElTooltipProps,
          | 'effect'
          | 'enterable'
          | 'hideAfter'
          | 'offset'
          | 'placement'
          | 'popperClass'
          | 'popperOptions'
          | 'showAfter'
          | 'showArrow'
        >
      >,
    },
    treeProps: {
      default: () => ({
        hasChildren: 'hasChildren',
        label: 'label',
        children: 'children',
      }),
      type: Object as PropType<{
        children?: string;
        hasChildren?: string;
        label?: string;
      }>,
    },
    // 视频自动预览字段数组
    videoPreview: {
      default: () => [],
      type: Array as PropType<string[]>,
    },
  },
  setup(props, { attrs, emit, expose, slots }) {
    const elTableRef = ref<ComponentRef<typeof ElTable>>();

    // 注册
    onMounted(() => {
      const tableRef = unref(elTableRef);
      emit('register', tableRef?.$parent, elTableRef.value);
    });

    const pageSizeRef = ref(props.pageSize);

    const currentPageRef = ref(props.currentPage);

    // useTable传入的props
    const outsideProps = ref<TableProps>({});

    const mergeProps = ref<TableProps>({});

    const getProps = computed(() => {
      const propsObj = { ...props };
      Object.assign(propsObj, unref(mergeProps));
      return propsObj;
    });

    const setProps = (props: TableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props);
      outsideProps.value = { ...props } as any;
    };

    const setColumn = (
      columnProps: TableSetProps[],
      columnsChildren?: TableColumn[],
    ) => {
      const { columns } = unref(getProps);
      for (const v of columnsChildren || columns) {
        for (const item of columnProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value);
          } else if (v.children?.length) {
            setColumn(columnProps, v.children);
          }
        }
      }
    };

    const addColumn = (column: TableColumn, index?: number) => {
      const { columns } = unref(getProps);
      if (index === void 0) {
        columns.push(column);
      } else {
        columns.splice(index, 0, column);
      }
    };

    const delColumn = (field: string) => {
      const { columns } = unref(getProps);
      const index = columns.findIndex((item) => item.field === field);
      if (index !== -1) {
        columns.splice(index, 1);
      }
    };

    const refresh = () => {
      emit('refresh');
    };

    const changSize = (size: ComponentSize) => {
      setProps({ size });
    };

    const confirmSetColumn = (columns: TableColumn[]) => {
      setProps({ columns });
    };

    expose({
      addColumn,
      delColumn,
      elTableRef,
      setColumn,
      setProps,
    });

    const pagination = computed(() => {
      return Object.assign(
        {
          background: false,
          disabled: false,
          hideOnSinglePage: false,
          layout: 'sizes, prev, pager, next, jumper, ->, total',
          pagerCount: 7,
          pageSizes: [10, 20, 30, 40, 50, 100],
          small: false,
          total: 10,
        },
        unref(getProps).pagination,
      );
    });

    watch(
      () => unref(getProps).pageSize,
      (val: number) => {
        pageSizeRef.value = val;
      },
    );

    watch(
      () => unref(getProps).currentPage,
      (val: number) => {
        currentPageRef.value = val;
      },
    );

    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit('update:pageSize', val);
      },
    );

    watch(
      () => currentPageRef.value,
      (val: number) => {
        emit('update:currentPage', val);
      },
    );

    const getBindValue = computed(() => {
      const bindValue: Recordable = { ...attrs, ...unref(getProps) };
      delete bindValue.columns;
      delete bindValue.data;
      delete bindValue.align;
      return bindValue;
    });

    const renderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const {
        align,
        headerAlign,
        imagePreview,
        showOverflowTooltip,
        videoPreview,
      } = unref(getProps);
      return columnsChildren.map((v) => {
        if (v.hidden) return null;
        const props = { ...v } as any;
        if (props.children) delete props.children;

        const children = v.children;

        const slots: TableSlotType = {
          default: (...args: any[]) => {
            const data = args[0];
            let isPreview = false;
            isPreview =
              imagePreview.some((item) => (item as string) === v.field) ||
              videoPreview.some((item) => (item as string) === v.field);

            return children && children.length > 0
              ? renderTreeTableColumn(children)
              : props?.slots?.default
                ? props.slots.default(...args)
                : v?.formatter
                  ? v?.formatter?.(
                      data.row,
                      data.column,
                      get(data.row, v.field),
                      data.$index,
                    )
                  : isPreview
                    ? renderPreview(get(data.row, v.field), v.field)
                    : get(data.row, v.field);
          },
        };
        if (props?.slots?.header) {
          slots.header = (...args: any[]) => props.slots.header(...args);
        }

        return (
          <ElTableColumn
            align={align}
            headerAlign={headerAlign}
            showOverflowTooltip={showOverflowTooltip}
            {...props}
            prop={v.field}
          >
            {slots}
          </ElTableColumn>
        );
      });
    };

    const renderPreview = (url: string, field: string) => {
      const { imagePreview, videoPreview } = unref(getProps);
      return (
        <div class="flex items-center">
          {imagePreview.includes(field) ? (
            <ElImage
              class="w-[100%]"
              fit="cover"
              lazy
              preview-src-list={[url]}
              preview-teleported
              src={url}
            />
          ) : videoPreview.includes(field) ? (
            <BaseButton
              icon={<Icon icon="ep:video-play" />}
              onClick={() => {
                createVideoViewer({
                  url,
                });
              }}
              type="primary"
            >
              预览
            </BaseButton>
          ) : null}
        </div>
      );
    };

    const renderTableColumn = (columnsChildren?: TableColumn[]) => {
      const {
        align,
        columns,
        currentPage,
        headerAlign,
        imagePreview,
        pageSize,
        reserveIndex,
        reserveSelection,
        showOverflowTooltip,
        videoPreview,
      } = unref(getProps);

      return (columnsChildren || columns).map((v) => {
        if (v.hidden) return null;
        if (v.type === 'index') {
          return (
            <ElTableColumn
              align={v.align || align}
              fixed={v.fixed}
              headerAlign={v.headerAlign || headerAlign}
              index={
                v.index
                  ? v.index
                  : (index) =>
                      setIndex(reserveIndex, index, pageSize, currentPage)
              }
              label={v.label}
              type="index"
              width="65px"
            ></ElTableColumn>
          );
        } else if (v.type === 'selection') {
          return (
            <ElTableColumn
              align={align}
              headerAlign={headerAlign}
              reserveSelection={reserveSelection}
              selectable={v.selectable}
              type="selection"
              width="50"
            ></ElTableColumn>
          );
        } else {
          const props = { ...v } as any;
          if (props.children) delete props.children;

          const children = v.children;

          const slots: TableSlotType = {
            default: (...args: any[]) => {
              const data = args[0];

              let isPreview = false;
              isPreview =
                imagePreview.some((item) => (item as string) === v.field) ||
                videoPreview.some((item) => (item as string) === v.field);

              return children && children.length > 0
                ? renderTreeTableColumn(children)
                : props?.slots?.default
                  ? props.slots.default(...args)
                  : v?.formatter
                    ? v?.formatter?.(
                        data.row,
                        data.column,
                        get(data.row, v.field),
                        data.$index,
                      )
                    : isPreview
                      ? renderPreview(get(data.row, v.field), v.field)
                      : get(data.row, v.field);
            },
          };
          if (props?.slots?.header) {
            slots.header = (...args: any[]) => props.slots.header(...args);
          }

          return (
            <ElTableColumn
              align={align}
              headerAlign={headerAlign}
              showOverflowTooltip={showOverflowTooltip}
              {...props}
              prop={v.field}
            >
              {slots}
            </ElTableColumn>
          );
        }
      });
    };

    return () => {
      const tableSlots: TableSlotType = {};
      if (getSlot(slots, 'empty')) {
        tableSlots.empty = (...args: any[]) => getSlot(slots, 'empty', args);
      }
      if (getSlot(slots, 'append')) {
        tableSlots.append = (...args: any[]) => getSlot(slots, 'append', args);
      }

      return (
        <div v-loading={unref(getProps).loading}>
          {unref(getProps).customContent ? (
            <div class="flex flex-wrap">
              {unref(getProps)?.data?.length ? (
                unref(getProps)?.data.map((item) => {
                  const cardSlots: TableSlotType = {
                    default: () => {
                      return getSlot(slots, 'content', item);
                    },
                  };
                  if (getSlot(slots, 'content-header')) {
                    cardSlots.header = () => {
                      return getSlot(slots, 'content-header', item);
                    };
                  }
                  if (getSlot(slots, 'content-footer')) {
                    cardSlots.footer = () => {
                      return getSlot(slots, 'content-footer', item);
                    };
                  }
                  return (
                    <ElCard
                      bodyClass={unref(getProps).cardBodyClass}
                      bodyStyle={unref(getProps).cardBodyStyle}
                      class={unref(getProps).cardWrapClass}
                      shadow="hover"
                      style={unref(getProps).cardWrapStyle}
                    >
                      {cardSlots}
                    </ElCard>
                  );
                })
              ) : (
                <div class="flex flex-1 justify-center">
                  <ElEmpty description="暂无数据" />
                </div>
              )}
            </div>
          ) : (
            <>
              {unref(getProps).showAction && !unref(getProps).customContent ? (
                <TableActions
                  columns={unref(getProps).columns}
                  onChangSize={changSize}
                  onConfirm={confirmSetColumn}
                  onRefresh={refresh}
                />
              ) : null}
              <ElTable
                data={unref(getProps).data}
                ref={elTableRef}
                {...unref(getBindValue)}
              >
                {{
                  default: () => renderTableColumn(),
                  ...tableSlots,
                }}
              </ElTable>
            </>
          )}
          {unref(getProps).pagination ? (
            <ElPagination
              class="mt-10px"
              v-model:currentPage={currentPageRef.value}
              v-model:pageSize={pageSizeRef.value}
              {...unref(pagination)}
            ></ElPagination>
          ) : undefined}
        </div>
      );
    };
  },
});
</script>
