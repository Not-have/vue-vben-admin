import type { FormSchema, FormSetProps } from '../Form';

import type { Recordable } from '#/types';

export { default as Search } from './src/Search.vue';

export interface SearchExpose {
  addSchema: (formSchema: FormSchema, index?: number) => void;
  delSchema: (field: string) => void;
  getFormData: <T = Recordable>() => Promise<T>;
  setProps: (props: Recordable) => void;
  setSchema: (schemaProps: FormSetProps[]) => void;
  setValues: (data: Recordable) => void;
}

export type { SearchProps } from './src/types';
