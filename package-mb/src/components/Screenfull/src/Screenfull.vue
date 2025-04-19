<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';

import { Icon } from '#/components/Icon';
import { propTypes } from '#/utils/propTypes';

defineProps({
  color: propTypes.string.def(''),
});

const { isFullscreen, toggle } = useFullscreen();

const toggleFullscreen = () => {
  toggle();
};
</script>

<template>
  <div class="screenfull" @click="toggleFullscreen">
    <Icon
      :size="18"
      :icon="isFullscreen ? 'zmdi:fullscreen-exit' : 'zmdi:fullscreen'"
      :color="color"
    />
  </div>
</template>
