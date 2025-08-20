<script setup lang="ts">
import { computed, nextTick, ref, unref, useAttrs, useSlots, watch } from 'vue';

import { ElDialog, ElScrollbar } from 'element-plus';

import { isNumber } from '#/utils/is';
import { propTypes } from '#/utils/propTypes';

import { Icon } from '../../Icon';

const props = defineProps({
  fullscreen: propTypes.bool.def(true),
  maxHeight: propTypes.oneOfType([String, Number]).def('400px'),
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('Dialog'),
});

const slots = useSlots();

const getBindValue = computed(() => {
  // eslint-disable-next-line unicorn/prefer-set-has
  const delArr: string[] = ['fullscreen', 'title', 'maxHeight'];
  const attrs = useAttrs();
  const obj = { ...attrs, ...props };
  for (const key in obj) {
    if (delArr.includes(key)) {
      delete obj[key as keyof typeof obj];
    }
  }
  return obj;
});

const isFullscreen = ref(false);

const toggleFull = () => {
  isFullscreen.value = !unref(isFullscreen);
};

const dialogHeight = ref(
  isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight,
);

watch(
  () => isFullscreen.value,
  async (val: boolean) => {
    await nextTick();
    if (val) {
      const windowHeight = document.documentElement.offsetHeight;
      dialogHeight.value = `${windowHeight - 55 - 60 - (slots.footer ? 63 : 0)}px`;
    } else {
      dialogHeight.value = isNumber(props.maxHeight)
        ? `${props.maxHeight}px`
        : props.maxHeight;
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => props.maxHeight,
  (val) => {
    dialogHeight.value = isNumber(val) ? `${val}px` : val;
  },
);

const dialogStyle = computed(() => {
  return {
    height: unref(dialogHeight),
  };
});
</script>

<template>
  <ElDialog
    v-bind="getBindValue"
    :fullscreen="isFullscreen"
    destroy-on-close
    lock-scroll
    draggable
    :close-on-click-modal="false"
    :show-close="false"
  >
    <template #header="{ close }">
      <div
        class="h-54px pl-15px pr-15px relative flex items-center justify-between"
      >
        <slot name="title">
          {{ title }}
        </slot>
        <div
          class="h-54px right-15px absolute top-[50%] flex translate-y-[-50%] items-center justify-between"
        >
          <Icon
            v-if="fullscreen"
            class="is-hover !h-54px mr-10px cursor-pointer"
            :icon="
              isFullscreen
                ? 'radix-icons:exit-full-screen'
                : 'radix-icons:enter-full-screen'
            "
            color="var(--el-color-info)"
            hover-color="var(--el-color-primary)"
            @click="toggleFull"
          />
          <Icon
            class="is-hover !h-54px cursor-pointer"
            icon="ep:close"
            hover-color="var(--el-color-primary)"
            color="var(--el-color-info)"
            @click="close"
          />
        </div>
      </div>
    </template>

    <ElScrollbar :style="dialogStyle">
      <slot></slot>
    </ElScrollbar>

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
</template>

<style scoped>
.h-54px {
  height: 54px;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
  right: 0;
}
</style>
