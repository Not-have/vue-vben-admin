<script setup lang="ts">
import { computed, unref } from 'vue';
import { useRouter } from 'vue-router';

import { propTypes } from '#/utils/propTypes';

const props = defineProps({
  permission: propTypes.string.def(),
});

const { currentRoute } = useRouter();

const currentPermission = computed<string[]>(() => {
  return (unref(currentRoute)?.meta?.permission as string[]) || [];
});

const hasPermission = computed(() => {
  const permission = unref(props.permission);
  if (!permission) {
    return true;
  }
  return unref(currentPermission).includes(permission);
});
</script>

<template>
  <template v-if="hasPermission">
    <slot></slot>
  </template>
</template>
