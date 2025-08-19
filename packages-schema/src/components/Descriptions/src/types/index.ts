import type { JSX } from 'vue/jsx-runtime';

export interface DescriptionsSchema {
  align?: 'center' | 'left' | 'right';
  className?: string;
  field: string; // 字段名
  label?: string; // label名
  labelAlign?: 'center' | 'left' | 'right';
  labelClassName?: string;
  minWidth?: number | string;
  slots?: {
    default?: (...args: any[]) => JSX.Element | null;
    label?: (...args: any[]) => JSX.Element | null;
  };
  span?: number; // 占多少分
  width?: number | string;
}
