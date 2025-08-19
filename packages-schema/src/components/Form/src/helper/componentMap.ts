import type { Component } from 'vue';

import type { ComponentName } from '../types';

import type { Recordable } from '#/types';

import {
  ElAutocomplete,
  ElCascader,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElDivider,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElTreeSelect,
  ElUpload,
} from 'element-plus';

import { Editor } from '#/components/Editor';
import { IconPicker } from '#/components/IconPicker';
import { InputPassword } from '#/components/InputPassword';
import { JsonEditor } from '#/components/JsonEditor';

const componentMap: Recordable<Component, ComponentName> = {
  Autocomplete: ElAutocomplete,
  Cascader: ElCascader,
  CheckboxButton: ElCheckboxGroup,
  CheckboxGroup: ElCheckboxGroup,
  ColorPicker: ElColorPicker,
  DatePicker: ElDatePicker,
  Divider: ElDivider,
  Editor,
  IconPicker,
  Input: ElInput,
  InputNumber: ElInputNumber,
  InputPassword,
  JsonEditor,
  RadioButton: ElRadioGroup,
  RadioGroup: ElRadioGroup,
  Rate: ElRate,
  Select: ElSelect,
  SelectV2: ElSelectV2,
  Slider: ElSlider,
  Switch: ElSwitch,
  TimePicker: ElTimePicker,
  TimeSelect: ElTimeSelect,
  Transfer: ElTransfer,
  TreeSelect: ElTreeSelect,
  Upload: ElUpload,
};

export { componentMap };
