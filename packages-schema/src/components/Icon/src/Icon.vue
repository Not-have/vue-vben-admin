<script setup lang="ts">
import { computed, unref } from 'vue';

import { Icon } from '@iconify/vue';
import { ElIcon } from 'element-plus';

import { propTypes } from '#/utils/propTypes';

const props = defineProps({
  // icon color
  color: propTypes.string,
  hoverColor: propTypes.string,
  // icon name
  icon: propTypes.string,
  // icon size
  size: propTypes.number.def(16),
});

const isLocal = computed(() => props.icon.startsWith('svg-icon:'));

const symbolId = computed(() => {
  return unref(isLocal)
    ? `#icon-${props.icon.split('svg-icon:')[1]}`
    : props.icon;
});

const getIconifyStyle = computed(() => {
  const { color, size } = props;
  return {
    color,
    fontSize: `${size}px`,
  };
});
</script>

<template>
  <ElIcon class="icon" :size="size" :color="color">
    <svg v-if="isLocal" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>

    <template v-else>
      <Icon :icon="icon" :style="getIconifyStyle" />
    </template>
  </ElIcon>
</template>
