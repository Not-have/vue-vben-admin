<script setup lang="ts">
import type { ButtonType, ComponentSize } from 'element-plus';

import type { Component, PropType } from 'vue';

import { computed } from 'vue';

import { ElButton } from 'element-plus';

const props = defineProps({
  autofocus: {
    default: false,
    type: Boolean,
  },
  autoInsertSpace: {
    default: false,
    type: Boolean,
  },
  bg: {
    default: false,
    type: Boolean,
  },
  circle: {
    default: false,
    type: Boolean,
  },
  color: {
    default: '',
    type: String,
  },
  darker: {
    default: false,
    type: Boolean,
  },
  disabled: {
    default: false,
    type: Boolean,
  },
  icon: {
    default: undefined,
    type: [String, Object] as PropType<Component | string>,
  },
  link: {
    default: false,
    type: Boolean,
  },
  loading: {
    default: false,
    type: Boolean,
  },
  loadingIcon: {
    default: undefined,
    type: [String, Object] as PropType<Component | string>,
  },
  nativeType: {
    default: 'button',
    type: String as PropType<'button' | 'reset' | 'submit'>,
  },
  plain: {
    default: false,
    type: Boolean,
  },
  round: {
    default: false,
    type: Boolean,
  },
  size: {
    default: undefined,
    type: String as PropType<ComponentSize>,
  },
  tag: {
    default: 'button',
    type: [String, Object] as PropType<Component | string>,
  },
  text: {
    default: false,
    type: Boolean,
  },
  type: {
    default: 'default',
    type: String as PropType<ButtonType>,
  },
});

const emits = defineEmits(['click']);

const style = computed(() => {
  const { link, type } = props;
  if (type === 'primary' && !link) {
    return '--el-button-text-color: #fff; --el-button-hover-text-color: #fff';
  }
  return '';
});
</script>

<template>
  <ElButton
    class="button color-#fff"
    v-bind="{ ...props }"
    :color="color"
    :style="style"
    @click="() => emits('click')"
  >
    <slot></slot>
    <slot name="icon"></slot>
    <slot name="loading"></slot>
  </ElButton>
</template>
