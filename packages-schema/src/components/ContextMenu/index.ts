import type { RouteLocationNormalizedLoaded } from 'vue-router';

import { ElDropdown } from 'element-plus';

type ComponentRef<T extends abstract new (...args: any) => any> =
  InstanceType<T>;

export { default as ContextMenu } from './src/ContextMenu.vue';

export interface ContextMenuExpose {
  elDropdownMenuRef: ComponentRef<typeof ElDropdown>;
  tagItem: RouteLocationNormalizedLoaded;
}

export type { ContextMenuSchema } from './src/types';
