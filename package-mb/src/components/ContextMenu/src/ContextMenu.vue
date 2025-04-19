<script setup lang="ts">
import type { ComponentPublicInstance, PropType } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

import type { ContextMenuSchema } from './types';

import { ref } from 'vue';

import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';

const props = defineProps({
  schema: {
    default: () => [],
    type: Array as PropType<ContextMenuSchema[]>,
  },
  tagItem: {
    default: () => ({}),
    type: Object as PropType<RouteLocationNormalizedLoaded>,
  },
  trigger: {
    default: 'contextmenu',
    type: String as PropType<'click' | 'contextmenu' | 'focus' | 'hover'>,
  },
});

const emit = defineEmits(['visibleChange']);

const command = (item: ContextMenuSchema) => {
  item.command && item.command(item);
};

const visibleChange = (visible: boolean) => {
  emit('visibleChange', visible, props.tagItem);
};

const elDropdownMenuRef = ref<ComponentPublicInstance<
  typeof ElDropdown
> | null>(null);

defineExpose({
  elDropdownMenuRef,
  tagItem: props.tagItem,
});
</script>

<template>
  <ElDropdown
    ref="elDropdownMenuRef"
    class="context-menu"
    :trigger="trigger"
    placement="bottom-start"
    @command="command"
    @visible-change="visibleChange"
    popper-class="v-context-menu-popper"
  >
    <slot></slot>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="(item, index) in schema"
          :key="`dropdown${index}`"
          :divided="item.divided"
          :disabled="item.disabled"
          :command="item"
        >
          <Icon :icon="item.icon" /> {{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
