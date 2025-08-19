import type { FormSchema, FormSetProps } from './src/types';

import type { Recordable } from '#/types';

export { default as Form } from './src/Form.vue';

export interface FormExpose {
  addSchema: (formSchema: FormSchema, index?: number) => void;
  delSchema: (field: string) => void;
  formModel: Recordable;
  getComponentExpose: (field: string) => any;
  getFormItemExpose: (field: string) => any;
  setProps: (props: Recordable) => void;
  setSchema: (schemaProps: FormSetProps[]) => void;
  setValues: (data: Recordable) => void;
}

export type {
  AutocompleteComponentProps,
  CascaderComponentProps,
  CheckboxGroupComponentProps,
  CheckboxOption,
  ColorPickerComponentProps,
  ColProps,
  ComponentName,
  ComponentNameEnum,
  DatePickerComponentProps,
  DateTimePickerComponentProps,
  DividerComponentProps,
  FormItemProps,
  FormProps,
  FormSchema,
  FormSetProps,
  InputComponentProps,
  InputNumberComponentProps,
  InputPasswordComponentProps,
  PlaceholderModel,
  RadioButtonComponentProps,
  RadioGroupComponentProps,
  RadioOption,
  RateComponentProps,
  SelectComponentProps,
  SelectOption,
  SelectV2ComponentProps,
  SwitchComponentProps,
  TimePickerComponentProps,
  TimeSelectComponentProps,
  TransferComponentProps,
  TreeSelectComponentProps,
} from './src/types';
