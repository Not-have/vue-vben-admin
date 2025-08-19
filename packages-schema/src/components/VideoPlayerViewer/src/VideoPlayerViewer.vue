<script setup lang="ts">
import { nextTick, ref } from 'vue';

import { ElOverlay } from 'element-plus';

import { Icon } from '#/components/Icon';
import { VideoPlayer } from '#/components/VideoPlayer';

const props = defineProps({
  id: {
    default: '',
    type: String,
  },
  poster: {
    default: '',
    type: String,
  },
  show: {
    default: false,
    type: Boolean,
  },
  url: {
    default: '',
    required: true,
    type: String,
  },
});

const visible = ref(props.show);

const close = async () => {
  visible.value = false;
  await nextTick();
  // eslint-disable-next-line unicorn/prefer-query-selector
  const wrap = document.getElementById(props.id);
  if (!wrap) return;
  wrap.remove();
};
</script>
<template>
  <ElOverlay v-show="visible" @click="close">
    <div
      class="relative flex h-full w-full items-center justify-center"
      @click="close"
    >
      <div
        class="w-44px h-44px color-[#fff] top-40px right-40px absolute flex cursor-pointer items-center justify-center rounded-full border-[#fff] bg-[var(--el-text-color-regular)]"
        @click="close"
      >
        <Icon icon="ep:close" :size="24" />
      </div>
      <VideoPlayer :url="url" :poster="poster" />
    </div>
  </ElOverlay>
</template>
