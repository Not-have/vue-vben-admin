<script lang="ts" setup>
import { nextTick, onMounted, ref, unref, watch } from 'vue';

import { useEventListener, useIntersectionObserver } from '@vueuse/core';
import { debounce } from 'lodash-es';

import { propTypes } from '#/utils/propTypes';

const prop = defineProps({
  autoCenter: propTypes.bool.def(true),
  cols: propTypes.number.def(undefined),
  data: propTypes.arrayOf(propTypes.any),
  end: propTypes.bool.def(false),
  endText: propTypes.string.def('没有更多了'),
  gap: propTypes.number.def(20),
  layout: propTypes.oneOf(['javascript', 'flex']).def('flex'),
  loading: propTypes.bool.def(false),
  loadingText: propTypes.string.def('加载中...'),
  props: propTypes.objectOf(propTypes.string).def({
    height: 'height',
    src: 'src',
  }),
  reset: propTypes.bool.def(true),
  width: propTypes.number.def(200),
});

const emit = defineEmits(['loadMore']);

const wrapEl = ref<HTMLDivElement>();

const heights = ref<number[]>([]);

const wrapHeight = ref(0);

const wrapWidth = ref(0);

const loadMore = ref<HTMLDivElement>();

// 首先确定列数 = 页面宽度 / 图片宽度
const innerCols = ref(0);

const filterData = ref<any[]>([]);

const filterWaterfall = async () => {
  filterData.value = [];
  const { gap, props, width } = prop;
  const data = prop.data as any[];
  await nextTick();

  const container = unref(wrapEl) as HTMLElement;
  if (!container) return;
  innerCols.value =
    prop.cols ?? Math.floor(container.clientWidth / (width + gap));

  const length = data.length;
  for (let i = 0; i < length; i++) {
    if (i < unref(innerCols)) {
      heights.value[i] = data[i][props.height as string];
      filterData.value.push({
        ...data[i],
        left: i * (width + gap),
        top: 0,
      });
    } else {
      // 其他行，先找出最矮的那一列 和 索引
      // 假设最小高度是第一个元素
      let minHeight = heights.value[0] ?? Infinity;
      let index = 0;
      // 找出最小高度
      for (let j = 1; j < unref(innerCols); j++) {
        if ((unref(heights)?.[j] ?? Infinity) < minHeight) {
          minHeight = unref(heights)[j] ?? Infinity;
          index = j;
        }
      }

      // 更新最矮高度
      heights.value[index] += data[i][props.height as string] + gap;
      filterData.value.push({
        ...data[i],
        left: index * (width + gap),
        top: minHeight + gap,
      });
    }
  }
  wrapHeight.value = Math.max(...unref(heights));
  wrapWidth.value = unref(innerCols) * (width + gap) - gap;
};

const flexWaterfall = async () => {
  const { gap, width } = prop;
  const data = prop.data as any[];
  await nextTick();

  const container = unref(wrapEl) as HTMLElement;
  if (!container) return;
  innerCols.value =
    prop.cols ?? Math.floor(container.clientWidth / (width + gap));

  const length = data.length;
  // 根据列数，创建数组
  // eslint-disable-next-line unicorn/no-new-array
  const arr = new Array(unref(innerCols)).fill([]);
  // 循环data，依次插入到arr中
  for (let i = 0; i < length; i++) {
    const index = i % unref(innerCols);
    arr[index] = [...arr[index], data[i]];
  }
  filterData.value = arr;
};

const initLayout = () => {
  const { layout } = prop;
  if (layout === 'javascript') {
    filterWaterfall();
  } else if (layout === 'flex') {
    flexWaterfall();
  }
};

watch(
  () => [prop.data, prop.cols],
  () => {
    initLayout();
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  if (unref(prop.reset)) {
    useEventListener(window, 'resize', debounce(initLayout, 300));
  }
  useIntersectionObserver(
    unref(loadMore),
    (entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting && !prop.loading && !prop.end) {
        emit('loadMore');
      }
    },
    {
      threshold: 0.1,
    },
  );
});
</script>

<template>
  <div
    class="waterfall flex items-center"
    :class="[
      {
        'justify-center': autoCenter,
      },
    ]"
    ref="wrapEl"
    :style="{
      height: `${layout === 'javascript' ? wrapHeight + 40 : 'auto'}px`,
    }"
  >
    <template v-if="layout === 'javascript'">
      <div
        class="relative"
        :style="{ width: `${wrapWidth}px`, height: `${wrapHeight + 40}px` }"
      >
        <div
          v-for="(item, $index) in filterData"
          :class="[
            `waterfall-item__${$index}`,
            {
              absolute: layout === 'javascript',
            },
          ]"
          :key="`water-${$index}`"
          :style="{
            width: `${width}px`,
            height: `${item[props.height as string]}px`,
            top: `${item.top}px`,
            left: `${item.left}px`,
          }"
        >
          <img
            :src="item[props.src as string]"
            class="block h-full w-full"
            alt=""
            srcset=""
          />
        </div>
        <div
          ref="loadMore"
          class="h-40px absolute flex w-full justify-center"
          :style="{
            top: `${wrapHeight + gap}px`,
          }"
        >
          {{ end ? endText : loadingText }}
        </div>
      </div>
    </template>
    <template v-else-if="layout === 'flex'">
      <div
        class="pb-40px relative flex"
        :style="{
          width: cols ? '100%' : 'auto',
        }"
      >
        <div
          v-for="(item, $index) in filterData"
          :key="`waterWrap-${$index}`"
          class="flex-1"
          :style="{
            marginRight: $index === filterData.length - 1 ? '0' : `${gap}px`,
          }"
        >
          <div
            v-for="(child, i) in item"
            :key="`waterWrap-${$index}-${i}`"
            :style="{
              marginBottom: `${gap}px`,
              width: cols ? '100%' : `${width}px`,
              height: cols ? 'auto' : `${child[props.height as string]}px`,
            }"
          >
            <img
              :src="child[props.src as string]"
              class="block h-full w-full"
              alt=""
              srcset=""
            />
          </div>
        </div>
        <div
          ref="loadMore"
          class="h-40px absolute flex w-full items-center justify-center"
          :style="{
            bottom: 0,
          }"
        >
          {{ end ? endText : loadingText }}
        </div>
      </div>
    </template>
  </div>
</template>
