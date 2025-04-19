import type { IEditorConfig } from '@wangeditor/editor';
import type {
  AutocompleteProps,
  CascaderNode,
  CascaderProps,
  CascaderValue,
  CheckboxGroupProps,
  ColorPickerProps,
  ComponentSize,
  DatePickerProps,
  DividerProps,
  FormItemProps as ElFormItemProps,
  FormProps as ElFormProps,
  InputNumberProps,
  InputProps,
  ISelectProps,
  RadioButtonProps,
  RadioGroupProps,
  RateProps,
  SwitchProps,
  TransferProps,
  UploadProps,
} from 'element-plus';
import type { JSX } from 'vue/jsx-runtime';

import type { CSSProperties } from 'vue';

import type { JsonEditorProps } from '#/components/JsonEditor';
import type { ElementPlusInfoType, Recordable } from '#/types';

export interface PlaceholderModel {
  endPlaceholder?: string;
  placeholder?: string;
  rangeSeparator?: string;
  startPlaceholder?: string;
}

export enum ComponentNameEnum {
  AUTOCOMPLETE = 'Autocomplete',
  CASCADER = 'Cascader',
  CHECKBOX_BUTTON = 'CheckboxButton',
  CHECKBOX_GROUP = 'CheckboxGroup',
  COLOR_PICKER = 'ColorPicker',
  DATE_PICKER = 'DatePicker',
  DIVIDER = 'Divider',
  EDITOR = 'Editor',
  ICON_PICKER = 'IconPicker',
  INPUT = 'Input',
  INPUT_NUMBER = 'InputNumber',
  INPUT_PASSWORD = 'InputPassword',
  JSON_EDITOR = 'JsonEditor',
  RADIO_BUTTON = 'RadioButton',
  RADIO_GROUP = 'RadioGroup',
  RATE = 'Rate',
  SELECT = 'Select',
  SELECT_V2 = 'SelectV2',
  SLIDER = 'Slider',
  SWITCH = 'Switch',
  TIME_PICKER = 'TimePicker',
  TIME_SELECT = 'TimeSelect',
  TRANSFER = 'Transfer',
  TREE_SELECT = 'TreeSelect',
  UPLOAD = 'Upload',
}

type CamelCaseComponentName = keyof typeof ComponentNameEnum extends infer K
  ? K extends string
    ? K extends `${infer A}_${infer B}`
      ? `${Capitalize<Lowercase<A>>}${Capitalize<Lowercase<B>>}`
      : Capitalize<Lowercase<K>>
    : never
  : never;

export type ComponentName = CamelCaseComponentName;

export interface InputPasswordComponentProps {
  strength?: boolean;
  style?: CSSProperties;
}

export interface InputComponentProps extends Partial<InputProps> {
  on?: {
    blur?: (event: FocusEvent) => void;
    change?: (value: number | string) => void;
    clear?: () => void;
    focus?: (event: FocusEvent) => void;
    input?: (value: number | string) => void;
  };
  rows?: number;
  slots?: {
    append?: (...args: any[]) => JSX.Element | null;
    prefix?: (...args: any[]) => JSX.Element | null;
    prepend?: (...args: any[]) => JSX.Element | null;
    suffix?: (...args: any[]) => JSX.Element | null;
  };
  style?: CSSProperties;
}

export interface AutocompleteComponentProps extends Partial<AutocompleteProps> {
  on?: {
    change?: (value: number | string) => void;
    select?: (item: any) => void;
  };
  slots?: {
    append?: (...args: any[]) => JSX.Element | null;
    default?: (...args: any[]) => JSX.Element | null;
    prefix?: (...args: any[]) => JSX.Element | null;
    prepend?: (...args: any[]) => JSX.Element | null;
    suffix?: (...args: any[]) => JSX.Element | null;
  };
  style?: CSSProperties;
}

export interface InputNumberComponentProps extends Partial<InputNumberProps> {
  on?: {
    blur?: (event: FocusEvent) => void;
    change?: (
      currentValue: number | undefined,
      oldValue: number | undefined,
    ) => void;
    focus?: (event: FocusEvent) => void;
  };
  style?: CSSProperties;
}

export interface SelectOption {
  [key: string]: any;
  disabled?: boolean;
  key?: number | string;
  label?: string;
  options?: SelectOption[];
  value?: any;
}

export interface SelectComponentProps
  extends Omit<Partial<ISelectProps>, 'options'> {
  on?: {
    blur?: (event: FocusEvent) => void;
    change?: (value: boolean | number | object | string) => void;
    clear?: () => void;
    focus?: (event: FocusEvent) => void;
    removeTag?: (tag: any) => void;
    visibleChange?: (visible: boolean) => void;
  };
  options?: SelectOption[];
  /**
   * 数据源的字段别名
   */
  props?: {
    children?: string;
    key?: string;
    label?: string;
    value?: string;
  };
  slots?: {
    default?: (options: SelectOption[]) => JSX.Element[] | null;
    empty?: (...args: any[]) => JSX.Element | null;
    optionDefault?: (option: SelectOption) => JSX.Element | null;
    optionGroupDefault?: (item: SelectOption) => JSX.Element;
    prefix?: (...args: any[]) => JSX.Element | null;
  };
  style?: CSSProperties;
}

export interface SelectV2ComponentProps {
  allowCreate?: boolean;
  autocomplete?: string;
  automaticDropdown?: boolean;
  clearable?: boolean;
  clearIcon?: JSX.Element | null | string;
  collapseTags?: boolean;
  collapseTagsTooltip?: boolean;
  disabled?: boolean;
  effect?: string;
  filterable?: boolean;
  height?: number;
  multiple?: boolean;
  multipleLimit?: number;
  name?: string;
  noDataText?: string;
  on?: {
    blur?: (event: FocusEvent) => void;
    change?: (value: boolean | number | object | string) => void;
    clear?: () => void;
    focus?: (event: FocusEvent) => void;
    removeTag?: (tag: any) => void;
    visibleChange?: (visible: boolean) => void;
  };
  options?: SelectOption[];
  persistent?: boolean;
  placeholder?: string;
  placement?: AutocompleteProps['placement'];
  popperClass?: string;
  popperOptions?: any;
  remote?: boolean;
  remoteMethod?: (query: string) => void;
  reserveKeyword?: boolean;
  scrollbarAlwaysOn?: boolean;
  size?: ComponentSize;
  slots?: {
    default?: (option: SelectOption) => JSX.Element | null;
  };
  style?: CSSProperties;
  teleported?: boolean;
  validateEvent?: boolean;
  valueKey?: string;
}

export interface CascaderComponentProps {
  beforeFilter?: (value: string) => boolean;
  clearable?: boolean;
  collapseTags?: boolean;
  collapseTagsTooltip?: boolean;
  debounce?: number;
  disabled?: boolean;
  filterable?: boolean;
  filterMethod?: (node: CascaderNode, keyword: string) => boolean;
  on?: {
    blur?: (event: FocusEvent) => void;
    change?: (value: CascaderValue) => void;
    expandChange?: (value: CascaderValue) => void;
    focus?: (event: FocusEvent) => void;
    removeTag?: (value: CascaderNode['valueByOption']) => void;
    visibleChange?: (value: boolean) => void;
  };
  options?: Record<string, unknown>[];
  placeholder?: string;
  popperClass?: string;
  props?: CascaderProps;
  separator?: string;
  showAllLevels?: boolean;
  size?: ComponentSize;
  slots?: {
    default?: (...args: any[]) => JSX.Element | null;
    empty?: (...args: any[]) => JSX.Element | null;
  };
  style?: CSSProperties;
  tagType?: ElementPlusInfoType;
  teleported?: boolean;
  validateEvent?: boolean;
}

export interface SwitchComponentProps extends Partial<SwitchProps> {
  on?: {
    change?: (value: boolean | number | string) => void;
  };
  style?: CSSProperties;
}

export interface RateComponentProps extends Partial<RateProps> {
  on?: {
    change?: (value: number) => void;
  };
  style?: CSSProperties;
}

export interface ColorPickerComponentProps extends Partial<ColorPickerProps> {
  on?: {
    activeChange?: (value: string) => void;
    change?: (value: string) => void;
  };
  style?: CSSProperties;
}

export interface TransferComponentProps extends Partial<TransferProps> {
  on?: {
    change?: (
      value: number | string,
      direction: 'left' | 'right',
      movedKeys: number[] | string[],
    ) => void;
    leftCheckChange?: (value: any[]) => void;
    rightCheckChange?: (value: any[]) => void;
  };
  slots?: {
    default?: (...args: any[]) => JSX.Element | null;
    leftFooter?: (...args: any[]) => JSX.Element | null;
    rightFooter?: (...args: any[]) => JSX.Element | null;
  };
  style?: CSSProperties;
}

export interface RadioOption {
  [key: string]: any;
  border?: boolean;
  disabled?: boolean;
  label?: string;
  name?: string;
  size?: ComponentSize;
  value?: boolean | number | string;
}
export interface RadioGroupComponentProps extends Partial<RadioGroupProps> {
  on?: {
    change?: (value: boolean | number | string) => void;
  };
  options?: RadioOption[];
  /**
   * 数据源的字段别名
   */
  props?: {
    disabled?: string;
    label?: string;
    value?: string;
  };
  slots?: {
    default?: (...args: any[]) => JSX.Element[] | null;
  };
  style?: CSSProperties;
}

export interface RadioButtonComponentProps extends Partial<RadioButtonProps> {
  on?: {
    change?: (value: boolean | number | string) => void;
  };
  options?: RadioOption[];
  /**
   * 数据源的字段别名
   */
  props?: {
    disabled?: string;
    label?: string;
    value?: string;
  };
  slots?: {
    default?: (...args: any[]) => JSX.Element[] | null;
  };
  style?: CSSProperties;
}

export interface CheckboxOption {
  [key: string]: any;
  border?: boolean;
  checked?: boolean;
  controls?: boolean;
  disabled?: boolean;
  falseLabel?: number | string;
  id?: string;
  indeterminate?: boolean;
  label?: string;
  name?: string;
  size?: ComponentSize;
  tabindex?: number | string;
  trueLabel?: number | string;
  validateEvent?: boolean;
  value?: boolean | number | string;
}

export interface CheckboxGroupComponentProps
  extends Partial<CheckboxGroupProps> {
  on?: {
    change?: (value: boolean | number | string) => void;
  };
  options?: CheckboxOption[];
  /**
   * 数据源的字段别名
   */
  props?: {
    disabled?: string;
    label?: string;
    value?: string;
  };
  slots?: {
    default?: (...args: any[]) => JSX.Element[] | null;
  };
  style?: CSSProperties;
}

export interface DividerComponentProps extends Partial<DividerProps> {
  on?: {
    change?: (value: number) => void;
    input?: (value: number) => void;
  };
  style?: CSSProperties;
}

export interface DatePickerComponentProps extends Partial<DatePickerProps> {
  on?: {
    blur?: (event: FocusEvent) => void;
    calendarChange?: (val: [Date, Date]) => void;
    change?: (value: Date | number | string | string[]) => void;
    focus?: (event: FocusEvent) => void;
    panelChange?: (date: any, mode: any, view: any) => void;
    visibleChange?: (visibility: boolean) => void;
  };
  slots?: {
    default?: (...args: any[]) => JSX.Element | null;
    rangeSeparator?: (...args: any[]) => JSX.Element | null;
  };
  style?: CSSProperties;
}

export interface DateTimePickerComponentProps {
  cellClassName?: ((date: Date) => string | undefined) | string;
  clearable?: boolean;
  clearIcon?: JSX.Element | string;
  defaultTime?: [Date, Date] | Date;
  defaultValue?: [Date, Date] | Date;
  disabled?: boolean;
  disabledDate?: (date: Date) => boolean;
  editable?: boolean;
  endPlaceholder?: string;
  format?: string;
  id?: string;
  name?: string;
  on?: {
    blur?: (event: FocusEvent) => void;
    calendarChange?: (val: [Date, Date]) => void;
    change?: (value: Date | number | string | string[]) => void;
    focus?: (event: FocusEvent) => void;
    visibleChange?: (visibility: boolean) => void;
  };
  placeholder?: string;
  popperClass?: string;
  prefixIcon?: JSX.Element | string;
  rangeSeparator?: string;
  readonly?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  shortcuts?: Array<{ text: string; value: Date | Function }>;
  size?: ComponentSize;
  slots?: {
    default?: (...args: any[]) => JSX.Element | null;
    rangeSeparator?: (...args: any[]) => JSX.Element | null;
  };
  startPlaceholder?: string;
  style?: CSSProperties;
  teleported?: boolean;
  timeArrowControl?: boolean;
  type?:
    | 'date'
    | 'daterange'
    | 'datetime'
    | 'datetimerange'
    | 'month'
    | 'week'
    | 'year';
  unlinkPanels?: boolean;
  valueFormat?: string;
}

export interface TimePickerComponentProps {
  arrowControl?: boolean;
  clearable?: boolean;
  clearIcon?: JSX.Element | string;
  defaultValue?: [Date, Date] | Date;
  disabled?: boolean;
  disabledHours?: (role: string, comparingDate?: any) => number[];
  disabledMinutes?: (
    hour: number,
    role: string,
    comparingDate?: any,
  ) => number[];
  disabledSeconds?: (
    hour: number,
    minute: number,
    role: string,
    comparingDate?: any,
  ) => number[];
  editable?: boolean;
  endPlaceholder?: string;
  format?: string;
  id?: string;
  isRange?: boolean;
  label?: string;
  name?: string;
  on?: {
    blur?: (event: FocusEvent) => void;
    change: (
      val:
        | [Date, Date]
        | [number, number]
        | [string, string]
        | Date
        | number
        | string,
    ) => void;
    focus?: (event: FocusEvent) => void;
    visibleChange?: (visibility: boolean) => void;
  };
  placeholder?: string;
  popperClass?: string;
  prefixIcon?: JSX.Element | string;
  rangeSeparator?: string;
  readonly?: boolean;
  size?: ComponentSize;
  startPlaceholder?: string;
  style?: CSSProperties;
  tabindex?: number | string;
  teleported?: boolean;
}

export interface TimeSelectComponentProps {
  clearable?: boolean;
  clearIcon?: JSX.Element | string;
  disabled?: boolean;
  editable?: boolean;
  effect?: string;
  end?: string;
  format?: string;
  maxTime?: string;
  minTime?: string;
  name?: string;
  on?: {
    blur?: (event: FocusEvent) => void;
    change?: (val: string) => void;
    focus?: (event: FocusEvent) => void;
  };
  placeholder?: string;
  prefixIcon?: JSX.Element | string;
  size?: ComponentSize;
  start?: string;
  step?: string;
  style?: CSSProperties;
}

export interface EditorComponentProps {
  editorConfig?: IEditorConfig;
  style?: CSSProperties;
}

export interface ColProps {
  lg?: number;
  md?: number;
  sm?: number;
  span?: number;
  tag?: string;
  xl?: number;
  xs?: number;
}

export interface FormSetProps {
  field: string;
  path: string;
  value: any;
}

export interface FormItemProps extends Partial<ElFormItemProps> {
  slots?: {
    default?: (...args: any[]) => JSX.Element | null;
    error?: (...args: any[]) => JSX.Element | null;
    label?: (...args: any[]) => JSX.Element | null;
  };
  style?: CSSProperties;
}

export interface UploadComponentProps extends Partial<UploadProps> {
  slots?: {
    default?: (...args: any[]) => JSX.Element | null;
    file?: (...args: any[]) => JSX.Element | null;
    tip?: (...args: any[]) => JSX.Element | null;
    trigger?: (...args: any[]) => JSX.Element | null;
  };
  style?: CSSProperties;
}

export interface TreeSelectComponentProps
  extends Omit<Partial<SelectComponentProps>, 'on' | 'props' | 'slots'> {
  accordion?: boolean;
  allowDrag?: (...args: any[]) => boolean;
  allowDrop?: (...args: any[]) => boolean;
  autoExpandParent?: boolean;
  checkOnClickNode?: boolean;
  checkStrictly?: boolean;
  currentNodeKey?: number | string;
  data?: any[];
  defaultCheckedKeys?: any[];
  defaultExpandAll?: boolean;
  defaultExpandedKeys?: any[];
  draggable?: boolean;
  emptyText?: string;
  expandOnClickNode?: boolean;
  filterNodeMethod?: (...args: any[]) => boolean;
  highlightCurrent?: boolean;
  icon?: ((...args: any[]) => JSX.Element | null) | string;
  indent?: number;
  lazy?: boolean;
  load?: (...args: any[]) => Promise<any>;
  nodeKey?: string;
  on?: {
    blur?: (event: FocusEvent) => void;
    change?: (value: boolean | number | object | string) => void;
    check?: (...args: any[]) => void;
    checkChange?: (...args: any[]) => void;
    clear?: () => void;
    currentChange?: (...args: any[]) => void;
    focus?: (event: FocusEvent) => void;
    nodeClick?: (...args: any[]) => void;
    nodeCollapse?: (...args: any[]) => void;
    nodeContextMenu?: (...args: any[]) => void;
    nodeDragEnd?: (...args: any[]) => void;
    nodeDragEnter?: (...args: any[]) => void;
    nodeDragLeave?: (...args: any[]) => void;
    nodeDragOver?: (...args: any[]) => void;
    nodeDragStart?: (...args: any[]) => void;
    nodeDrop?: (...args: any[]) => void;
    nodeExpand?: (...args: any[]) => void;
    removeTag?: (tag: any) => void;
    visibleChange?: (visible: boolean) => void;
  };
  props?: {
    children?: string;
    class?: ((...args: any[]) => string) | string;
    disabled?: ((...args: any[]) => string) | string;
    isLeaf?: ((...args: any[]) => string) | string;
    label?: ((...args: any[]) => string) | string;
  };
  renderAfterExpand?: boolean;
  renderContent?: (...args: any[]) => JSX.Element | null;
  showCheckbox?: boolean;
  slots?: {
    default?: (...args: any[]) => JSX.Element | null;
    empty?: (...args: any[]) => JSX.Element | null;
    optionDefault?: (option: SelectOption) => JSX.Element | null;
    optionGroupDefault?: (item: SelectOption) => JSX.Element;
    prefix?: (...args: any[]) => JSX.Element | null;
  };
  style?: CSSProperties;
}

export interface FormSchema {
  /**
   * col组件属性
   */
  colProps?: ColProps;

  /**
   * 渲染的组件名称
   */
  component?: ComponentName;

  /**
   * 表单组件属性，具体可以查看element-plus文档
   */
  componentProps?:
    | any
    | AutocompleteComponentProps
    | CascaderComponentProps
    | ColorPickerComponentProps
    | DatePickerComponentProps
    | DateTimePickerComponentProps
    | DividerComponentProps
    | InputComponentProps
    | InputNumberComponentProps
    | InputPasswordComponentProps
    | JsonEditorProps
    | RadioButtonComponentProps
    | RadioGroupComponentProps
    | RateComponentProps
    | SelectComponentProps
    | SelectV2ComponentProps
    | SwitchComponentProps
    | TimePickerComponentProps
    | TransferComponentProps
    | TreeSelectComponentProps
    | UploadComponentProps;

  /**
   * 唯一标识
   */
  field: string;

  /**
   * formItem组件属性，具体可以查看element-plus文档
   */
  formItemProps?: FormItemProps;

  /**
   * 样式隐藏，不会把值一同删掉，类似v-show
   */
  hidden?: boolean;

  /**
   * 标题
   */
  label?: string;

  /**
   * @returns 远程加载下拉项
   */
  optionApi?: any;

  /**
   * 是否隐藏，如果为true，会连同值一同删除，类似v-if
   */
  remove?: boolean;

  /**
   * 初始值
   */
  value?: any;
}

export interface FormProps extends Partial<ElFormProps> {
  [key: string]: any;
  autoSetPlaceholder?: boolean;
  isCol?: boolean;
  isCustom?: boolean;
  model?: Recordable;
  schema?: FormSchema[];
}
