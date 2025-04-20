<script setup lang="ts">
import { reactive } from 'vue';

import { Page } from '@vben/common-ui';
import { Form, FormSchema } from '@vben/mb/components/Form';
import { useForm } from '@vben/mb/hooks/web/useForm';

const schema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: 'input',
    component: 'Input',
  },
]);

const { formRegister } = useForm();
</script>
<template>
  <Page title="表单的使用">
    <Form :schema="schema" @register="formRegister" />
  </Page>
</template>
