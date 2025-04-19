<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { BaseButton } from '@vben/mb/components/Button';
import { Qrcode } from '@vben/mb/components/Qrcode';
</script>

<template>
  <Page description="mb 嵌入到 vben 中" title="Element Plus组件使用演示">
    <BaseButton type="primary">按钮</BaseButton>

    <Qrcode text="title" />
  </Page>
</template>
