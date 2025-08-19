<script setup lang="ts">
import type { PropType } from 'vue';

import { computed, onMounted, reactive, toRef, unref, watch } from 'vue';

import { isNumber } from '#/utils/is';
import { propTypes } from '#/utils/propTypes';

const props = defineProps({
  autoplay: propTypes.bool.def(true),
  decimal: propTypes.string.def('.'),
  decimals: propTypes.number.validate((value: number) => value >= 0).def(0),
  duration: propTypes.number.def(3000),
  easingFn: {
    default(t: number, b: number, c: number, d: number) {
      return (c * (-(2 ** ((-10 * t) / d)) + 1) * 1024) / 1023 + b;
    },
    type: Function as PropType<
      (t: number, b: number, c: number, d: number) => number
    >,
  },
  endVal: propTypes.number.def(2021),
  prefix: propTypes.string.def(''),
  separator: propTypes.string.def(','),
  startVal: propTypes.number.def(0),
  suffix: propTypes.string.def(''),
  useEasing: propTypes.bool.def(true),
});

const emit = defineEmits(['mounted', 'callback']);

const formatNumber = (num: number | string) => {
  const { decimal, decimals, prefix, separator, suffix } = props;
  num = Number(num).toFixed(decimals);
  num += '';
  const x = num.split('.');
  let x1 = x[0] || '';
  const x2 = x.length > 1 ? decimal + x[1] : '';
  const rgx = /(\d+)(\d{3})/;
  if (separator && !isNumber(separator)) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, `$1${separator}$2`);
    }
  }
  return prefix + x1 + x2 + suffix;
};

const state = reactive<{
  displayValue: string;
  localDuration: null | number;
  localStartVal: number;
  paused: boolean;
  printVal: null | number;
  rAF: any;
  remaining: null | number;
  startTime: null | number;
  timestamp: null | number;
}>({
  displayValue: formatNumber(props.startVal),
  localDuration: props.duration,
  localStartVal: props.startVal,
  paused: false,
  printVal: null,
  rAF: null,
  remaining: null,
  startTime: null,
  timestamp: null,
});

const displayValue = toRef(state, 'displayValue');

onMounted(() => {
  if (props.autoplay) {
    start();
  }
  emit('mounted');
});

const getCountDown = computed(() => {
  return props.startVal > props.endVal;
});

watch([() => props.startVal, () => props.endVal], () => {
  if (props.autoplay) {
    start();
  }
});

const start = () => {
  const { duration, startVal } = props;
  state.localStartVal = startVal;
  state.startTime = null;
  state.localDuration = duration;
  state.paused = false;
  state.rAF = requestAnimationFrame(count);
};

const pauseResume = () => {
  if (state.paused) {
    resume();
    state.paused = false;
  } else {
    pause();
    state.paused = true;
  }
};

const pause = () => {
  cancelAnimationFrame(state.rAF);
};

const resume = () => {
  state.startTime = null;
  state.localDuration = +(state.remaining as number);
  state.localStartVal = +(state.printVal as number);
  requestAnimationFrame(count);
};

const reset = () => {
  state.startTime = null;
  cancelAnimationFrame(state.rAF);
  state.displayValue = formatNumber(props.startVal);
};

const count = (timestamp: number) => {
  const { easingFn, endVal, useEasing } = props;
  if (!state.startTime) state.startTime = timestamp;
  state.timestamp = timestamp;
  const progress = timestamp - state.startTime;
  state.remaining = (state.localDuration as number) - progress;
  if (useEasing) {
    state.printVal = unref(getCountDown)
      ? state.localStartVal -
        easingFn(
          progress,
          0,
          state.localStartVal - endVal,
          state.localDuration as number,
        )
      : easingFn(
          progress,
          state.localStartVal,
          endVal - state.localStartVal,
          state.localDuration as number,
        );
  } else {
    state.printVal = unref(getCountDown)
      ? state.localStartVal -
        (state.localStartVal - endVal) *
          (progress / (state.localDuration as number))
      : state.localStartVal +
        (endVal - state.localStartVal) *
          (progress / (state.localDuration as number));
  }
  state.printVal = unref(getCountDown)
    ? Math.max(state.printVal, endVal)
    : Math.min(state.printVal, endVal);
  state.displayValue = formatNumber(state.printVal!);
  if (progress < (state.localDuration as number)) {
    state.rAF = requestAnimationFrame(count);
  } else {
    emit('callback');
  }
};

defineExpose({
  pause,
  pauseResume,
  reset,
  start,
});
</script>

<template>
  <span class="count-to">
    {{ displayValue }}
  </span>
</template>
