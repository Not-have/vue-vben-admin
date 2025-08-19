<script setup lang="ts">
import { BaseButton } from '#/components/Button';
import { propTypes } from '#/utils/propTypes';

import noPermission from './assets/svgs/403.svg';
import pageError from './assets/svgs/404.svg';
import networkError from './assets/svgs/500.svg';

interface ErrorMap {
  buttonText: string;
  message: string;
  url: string;
}

const props = defineProps({
  type: propTypes.string
    .validate((v: string) => ['403', '404', '500'].includes(v))
    .def('404'),
});

const emit = defineEmits(['errorClick']);

const errorMap: {
  [key: string]: ErrorMap;
} = {
  '403': {
    buttonText: '返回首页',
    message: '抱歉，您无权访问此页面。',
    url: noPermission,
  },
  '404': {
    buttonText: '返回首页',
    message: '抱歉，您访问的页面不存在。',
    url: pageError,
  },
  '500': {
    buttonText: '返回首页',
    message: '抱歉，服务器报告错误。',
    url: networkError,
  },
};

const btnClick = () => {
  emit('errorClick', props.type);
};
</script>

<template>
  <div class="flex justify-center">
    <div class="text-center">
      <img width="350" :src="errorMap[type]?.url" alt="" />
      <div class="text-14px text-[var(--el-color-info)]">
        {{ errorMap[type]?.message }}
      </div>
      <div class="mt-20px">
        <BaseButton type="primary" @click="btnClick">
          {{ errorMap[type]?.buttonText }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
