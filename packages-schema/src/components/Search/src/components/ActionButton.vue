<script setup lang="ts">
import { BaseButton } from '#/components/Button';
import { useIcon } from '#/hooks/web/useIcon';
import { propTypes } from '#/utils/propTypes';

defineProps({
  resetLoading: propTypes.bool.def(false),
  searchLoading: propTypes.bool.def(false),
  showExpand: propTypes.bool.def(false),
  showReset: propTypes.bool.def(true),
  showSearch: propTypes.bool.def(true),
  visible: propTypes.bool.def(true),
});

const emit = defineEmits(['search', 'reset', 'expand']);

const onSearch = () => {
  emit('search');
};

const onReset = () => {
  emit('reset');
};

const onExpand = () => {
  emit('expand');
};
</script>

<template>
  <BaseButton
    v-if="showSearch"
    type="primary"
    :loading="searchLoading"
    :icon="useIcon({ icon: 'ep:search' })"
    @click="onSearch"
  >
    查询
  </BaseButton>
  <BaseButton
    v-if="showReset"
    :loading="resetLoading"
    plain
    :icon="useIcon({ icon: 'ep:refresh-right' })"
    @click="onReset"
  >
    重置
  </BaseButton>
  <BaseButton
    v-if="showExpand"
    :icon="useIcon({ icon: visible ? 'ep:arrow-up' : 'ep:arrow-down' })"
    text
    @click="onExpand"
  >
    {{ visible ? '收起' : '展开' }}
  </BaseButton>
</template>
