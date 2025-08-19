<script setup lang="ts">
import type { EChartsOption } from 'echarts';

import type { PropType } from 'vue';

import {
  computed,
  onActivated,
  onBeforeUnmount,
  onMounted,
  ref,
  unref,
  watch,
} from 'vue';

import { usePreferences } from '@vben/preferences';

import { debounce } from 'lodash-es';

import echarts from '#/plugins/echarts';
import { isString } from '#/utils/is';
import { propTypes } from '#/utils/propTypes';

import 'echarts-wordcloud';

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('500px'),
  options: {
    required: true,
    type: Object as PropType<EChartsOption>,
  },
  width: propTypes.oneOfType([Number, String]).def('100%'),
});

const { isDark } = usePreferences();

const theme = computed(() => {
  const echartTheme: boolean | string = unref(isDark) ? true : 'auto';

  return echartTheme;
});

const options = computed(() => {
  return Object.assign(props.options, {
    darkMode: unref(theme),
  });
});

type Nullable<T> = null | T;

type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

const elRef = ref<ElRef>();

let echartRef: Nullable<echarts.ECharts> = null;

const contentEl = ref<Element>();

const styles = computed(() => {
  const width = isString(props.width) ? props.width : `${props.width}px`;
  const height = isString(props.height) ? props.height : `${props.height}px`;

  return {
    height,
    width,
  };
});

const initChart = () => {
  if (unref(elRef) && props.options) {
    echartRef = echarts.init(unref(elRef) as HTMLElement);
    echartRef?.setOption(unref(options));
  }
};

watch(
  () => options.value,
  (options) => {
    if (echartRef) {
      echartRef?.setOption(options);
    }
  },
  {
    deep: true,
  },
);

const resizeHandler = debounce(() => {
  if (echartRef) {
    echartRef.resize();
  }
}, 100);

const contentResizeHandler = async (e: TransitionEvent) => {
  if (e.propertyName === 'width') {
    resizeHandler();
  }
};

onMounted(() => {
  setTimeout(() => {
    initChart();
  }, 0);

  window.addEventListener('resize', resizeHandler);

  contentEl.value = document.querySelectorAll(`.layout-content`)[0];
  unref(contentEl) &&
    (unref(contentEl) as any).addEventListener(
      'transitionend',
      contentResizeHandler,
    );
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler);
  unref(contentEl) &&
    (unref(contentEl) as any).removeEventListener(
      'transitionend',
      contentResizeHandler,
    );
});

onActivated(() => {
  if (echartRef) {
    echartRef.resize();
  }
});
</script>

<template>
  <div ref="elRef" class="echart" :class="[$attrs.class]" :style="styles"></div>
</template>
