<script setup lang="ts">
import { ElCard } from 'element-plus';

import { propTypes } from '#/utils/propTypes';

defineProps({
  message: propTypes.string.def(''),
  title: propTypes.string.def(''),
});
</script>

<template>
  <div class="relative p-5">
    <ElCard class="content-detail-wrap-body mb-20px" shadow="never">
      <div
        class="mb-20px pb-20px"
        style="border-bottom: 1px solid var(--el-border-color)"
      >
        <slot name="header"></slot>
      </div>
      <slot></slot>
    </ElCard>
  </div>
</template>
<style scoped>
.mb-20px {
  margin-bottom: 20px;
}

.pb-20px {
  padding-bottom: 20px;
}

.relative {
  position: relative;
}
</style>
