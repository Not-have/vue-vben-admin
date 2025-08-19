import type { TableProps as ElTableProps } from 'element-plus';
import type { JSX } from 'vue/jsx-runtime';

import type { Recordable } from '#/types';

export interface TableColumn {
  [key: string]: any;
  align?: 'center' | 'left' | 'right';
  children?: TableColumn[];
  className?: string;
  columnKey?: string;
  field: string;
  filteredValue?: string[];
  filterMethod?: (...args: any[]) => boolean;
  filterMultiple?: boolean;
  filterPlacement?: string;
  filters?: Array<{ text: string; value: string }>;
  fixed?: 'left' | 'right' | boolean;
  formatter?: (...args: any[]) => any;
  headerAlign?: 'center' | 'left' | 'right';
  /**
   * 是否隐藏
   */
  hidden?: boolean;
  index?: ((index: number) => number) | number;
  label?: string;
  labelClassName?: string;
  minWidth?: number | string;
  renderHeader?: (...args: any[]) => JSX.Element | null;
  reserveSelection?: boolean;
  resizable?: boolean;
  selectable?: (...args: any[]) => boolean;
  showOverflowTooltip?: boolean;
  slots?: {
    default?: (...args: any[]) => JSX.Element | JSX.Element[] | null;
    header?: (...args: any[]) => JSX.Element | null;
  };
  sortBy?: ((...args: any[]) => string | string[]) | string | string[];
  // sortable?: boolean
  sortMethod?: (...args: any[]) => number;
  sortOrders?: (null | string)[];
  type?: string;
  width?: number | string;
}

export interface TableSlotType {
  append?: (...args: any[]) => any;
  default?: (...args: any[]) => any;
  empty?: (...args: any[]) => any;
  footer?: (...args: any[]) => any;
  header?: (...args: any[]) => any;
}

export interface TableSlotDefault {
  $index: number;
  [key: string]: any;
  column: TableColumn;
  row: Recordable;
}

export interface Pagination {
  background?: boolean;
  currentPage?: number;
  defaultCurrentPage?: number;
  defaultPageSize?: number;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  layout?: string;
  nextText?: string;
  pageCount?: number;
  pagerCount?: number;
  pageSize?: number;
  pageSizes?: number[];
  popperClass?: string;
  prevText?: string;
  small?: boolean;
  total?: number;
}

export interface TableSetProps {
  field: string;
  path: string;
  value: any;
}

export interface TableProps extends Omit<Partial<ElTableProps<any[]>>, 'data'> {
  // 对齐方式
  align?: 'center' | 'left' | 'right';
  // 表头
  columns?: TableColumn[];
  currentPage?: number;
  data?: Recordable;
  // 表头对齐方式
  headerAlign?: 'center' | 'left' | 'right';
  // 加载状态
  loading?: boolean;
  pageSize?: number;
  // 是否展示分页
  pagination?: Pagination | undefined;
  preview?: string[];
  // 是否叠加索引
  reserveIndex?: boolean;
  // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
  reserveSelection?: boolean;
  showAction?: boolean;
  // 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip,
  showOverflowTooltip?: boolean;
  sortable?: boolean;
}
