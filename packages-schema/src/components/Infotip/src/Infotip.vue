<script setup lang="ts">
import type { PropType } from 'vue';

import type { InfoTipSchema } from './types';

import { Highlight } from '#/components/Highlight';
import { propTypes } from '#/utils/propTypes';

defineProps({
  highlightColor: propTypes.string.def('var(--el-color-primary)'),
  schema: {
    default: () => [],
    required: true,
    type: Array as PropType<Array<InfoTipSchema | string>>,
  },
  showIndex: propTypes.bool.def(true),
  title: propTypes.string.def(''),
});

const emit = defineEmits(['click']);

const keyClick = (key: string) => {
  emit('click', key);
};
</script>

<template>
  <div
    class="infotip p-20px mb-20px border-1px border-solid border-[var(--el-color-primary)] bg-[var(--el-color-primary-light-9)]"
  >
    <div v-if="title" class="infotip__header flex items-center">
      <Icon
        icon="bi:exclamation-circle-fill"
        :size="22"
        color="var(--el-color-primary)"
      />
      <span class="infotip__title pl-5px text-16px font-bold">{{ title }}</span>
    </div>
    <div class="infotip__content">
      <p
        v-for="(item, $index) in schema"
        :key="$index"
        class="text-14px mt-15px"
      >
        <Highlight
          :keys="typeof item === 'string' ? [] : item.keys"
          :color="highlightColor"
          @click="keyClick"
        >
          {{ showIndex ? `${$index + 1}、` : ''
          }}{{ typeof item === 'string' ? item : item.label }}
        </Highlight>
      </p>
    </div>
  </div>
</template>
