<script setup lang="ts">
import type { PropType } from 'vue';

import type { Recordable } from '#/types';

import { computed, ref } from 'vue';

import { ElImageViewer } from 'element-plus';

import { propTypes } from '#/utils/propTypes';

const props = defineProps({
  hideOnClickModal: propTypes.bool.def(false),
  infinite: propTypes.bool.def(true),
  initialIndex: propTypes.number.def(0),
  show: propTypes.bool.def(false),
  teleported: propTypes.bool.def(false),
  urlList: {
    default: (): string[] => [],
    type: Array as PropType<string[]>,
  },
  zIndex: propTypes.number.def(200),
});

const getBindValue = computed(() => {
  const propsData: Recordable = { ...props };
  delete propsData.show;
  return propsData;
});

const show = ref(props.show);

const close = () => {
  show.value = false;
};
</script>

<template>
  <ElImageViewer v-if="show" v-bind="getBindValue" @close="close" />
</template>
