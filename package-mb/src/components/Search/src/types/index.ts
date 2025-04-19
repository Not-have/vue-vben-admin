import type { FormSchema } from '#/components/Form';
import type { Recordable } from '#/types';

export interface SearchProps {
  buttonPosition?: 'center' | 'left' | 'right';
  expandField?: string;
  inline?: boolean;
  isCol?: boolean;
  labelWidth?: number | string;
  layout?: 'bottom' | 'inline';
  model?: Recordable;
  removeNoValueItem?: boolean;
  schema?: FormSchema[];
  showExpand?: boolean;
  showReset?: boolean;
  showSearch?: boolean;
}
