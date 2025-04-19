import type { TableColumn, TableSetProps } from './src/types';

import type { ComponentRef, Recordable } from '#/types';

import { ElTable } from 'element-plus';

export { default as Table } from './src/Table.vue';

export interface TableExpose {
  addColumn: (column: TableColumn, index?: number) => void;
  delColumn: (field: string) => void;
  elTableRef: ComponentRef<typeof ElTable>;
  setColumn: (columnProps: TableSetProps[]) => void;
  setProps: (props: Recordable) => void;
}

export type {
  Pagination,
  TableColumn,
  TableProps,
  TableSetProps,
  TableSlotDefault,
} from './src/types';
