<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { BaseButton } from '@vben/mb/components/Button';
import { Qrcode } from '@vben/mb/components/Qrcode';

import { getExampleTableApi } from '#/api/core/table';

getExampleTableApi({
  page: 1,
  pageSize: 10,
})
  .then((res) => {
    // eslint-disable-next-line no-console
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });
</script>

<template>
  <Page description="mb 嵌入到 vben 中" title="Element Plus组件使用演示">
    <BaseButton type="primary">按钮</BaseButton>

    <Qrcode text="title" />
  </Page>
</template>
