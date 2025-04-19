<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue';

import Player from 'xgplayer';

import 'xgplayer/dist/index.min.css';

const props = defineProps({
  poster: {
    default: '',
    type: String,
  },
  url: {
    default: '',
    required: true,
    type: String,
  },
});

const playerRef = ref<Player>();

const videoEl = ref<HTMLDivElement>();

const intiPlayer = () => {
  if (!unref(videoEl)) return;
  playerRef.value = new Player({
    autoplay: false,
    ...props,
    el: unref(videoEl),
  });
};

onMounted(() => {
  intiPlayer();
});

watch(
  () => props,
  async (newProps) => {
    await nextTick();
    if (newProps) {
      unref(playerRef)?.setConfig(newProps);
    }
  },
  {
    deep: true,
  },
);

onBeforeUnmount(() => {
  unref(playerRef)?.destroy();
});

defineExpose({
  playerExpose: () => unref(playerRef),
});
</script>

<template>
  <div ref="videoEl"></div>
</template>
