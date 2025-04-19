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

// 是否使用在线图标
const isUseOnline = computed(() => {
  return import.meta.env.VITE_USE_ONLINE_ICON === 'true';
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
      <Icon v-if="isUseOnline" :icon="icon" :style="getIconifyStyle" />
      <div v-else :class="`${icon} iconify`" :style="getIconifyStyle"></div>
    </template>
  </ElIcon>
</template>

<style lang="less" scoped>
.icon,
.iconify {
  :deep(svg) {
    &:hover {
      // stylelint-disable-next-line
      color: v-bind(hoverColor) !important;
    }
  }
}

.iconify {
  &:hover {
    // stylelint-disable-next-line
    color: v-bind(hoverColor) !important;
  }
}
</style>
