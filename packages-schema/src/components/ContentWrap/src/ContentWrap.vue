<script setup lang="ts">
import { ElCard, ElTooltip } from 'element-plus';

import { Icon } from '#/components/Icon';
import { propTypes } from '#/utils/propTypes';

defineProps({
  message: propTypes.string.def(''),
  title: propTypes.string.def(''),
});
</script>

<template>
  <ElCard class="content-wrap" shadow="never">
    <template v-if="title" #header>
      <div class="flex items-center">
        <span class="text-16px font-700">{{ title }}</span>
        <ElTooltip v-if="message" effect="dark" placement="right">
          <template #content>
            <div class="max-w-200px">{{ message }}</div>
          </template>
          <Icon class="ml-5px" icon="bi:question-circle-fill" :size="14" />
        </ElTooltip>
        <div class="pl-20px flex flex-grow">
          <slot name="header"></slot>
        </div>
      </div>
    </template>
    <div>
      <slot></slot>
    </div>
  </ElCard>
</template>
