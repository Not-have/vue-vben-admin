<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable no-console -->
<script setup lang="tsx">
import type { FormSchema } from 'mb-admin/components/Form';
import type { TableColumn } from 'mb-admin/components/Table';
import type { Recordable } from 'mb-admin/types';

import { h, reactive, ref } from 'vue';

import { ElTag } from 'element-plus';
import { BaseButton } from 'mb-admin/components/Button';
import { ContentWrap } from 'mb-admin/components/ContentWrap';
import { Dialog } from 'mb-admin/components/Dialog';
import { Form } from 'mb-admin/components/Form';
import { Table } from 'mb-admin/components/Table';
import { useForm } from 'mb-admin/hooks/web/useForm';
import { useValidator } from 'mb-admin/hooks/web/useValidator';

type TableData = any;

const columns: TableColumn[] = [
  {
    field: 'title',
    label: '标题',
  },
  {
    field: 'author',
    label: '作者',
  },
  {
    field: 'display_time',
    label: '创建时间',
    sortable: true,
  },
  {
    field: 'importance',
    label: '重要性',
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type:
            cellValue === 1
              ? 'success'
              : (cellValue === 2
                ? 'warning'
                : 'danger'),
        },
        () => (cellValue === 1 ? '重要' : (cellValue === 2 ? '良好' : '一般')),
      );
    },
  },
  {
    field: 'pageviews',
    label: '阅读数',
  },
  {
    field: 'action',
    label: '操作',
    slots: {
      default: (data) => {
        return (
          <BaseButton onClick={() => actionFn(data)} type="primary">
            操作
          </BaseButton>
        );
      },
    },
  },
];

const loading = ref(true);

const tableDataList = ref<TableData[]>([]);

const getTableList = async () => {
  loading.value = false;
  // 模拟数据
  tableDataList.value = [
    {
      title: '标题1',
      author: '作者1',
      display_time: '2023-01-01',
      importance: 1,
      pageviews: 100,
    },
    {
      title: '标题2',
      author: '作者2',
      display_time: '2023-01-02',
      importance: 2,
      pageviews: 200,
    },
  ];
};

getTableList();

const actionFn = (data: any) => {
  console.log(data);
  dialogVisible.value = true;
};

const dialogVisible = ref(false);

const { required } = useValidator();

const { formRegister, formMethods } = useForm();
const { getElFormExpose } = formMethods;

const schema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: '输入框',
    component: 'Input',
    formItemProps: {
      rules: [required()],
    },
  },
  {
    field: 'field2',
    label: '选择器',
    component: 'Select',
    optionApi: async () => {
      return [];
    },
  },
  {
    field: 'field3',
    label: '单选框',
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: 'option-1',
          value: '1',
        },
        {
          label: 'option-2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'field4',
    label: '多选框',
    component: 'CheckboxGroup',
    value: [],
    componentProps: {
      options: [
        {
          label: 'option-1',
          value: '1',
        },
        {
          label: 'option-2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'field5',
    component: 'DatePicker',
    label: '日期选择器',
    componentProps: {
      type: 'date',
    },
  },
  {
    field: 'field6',
    component: 'TimeSelect',
    label: '时间选择',
  },
]);

const formSubmit = async () => {
  const elFormExpose = await getElFormExpose();
  elFormExpose?.validate((valid: any) => {
    if (valid) {
      console.log('submit success');
    } else {
      console.log('submit fail');
    }
  });
};
</script>

<template>
  <ContentWrap title="表格" message="基于 ElementPlus 的 Table 组件二次封装">
    <Table
      :columns="columns"
      :data="tableDataList"
      :loading="loading"
      :default-sort="{ prop: 'display_time', order: 'descending' }"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" title="弹窗">
    <Form :schema="schema" @register="formRegister" />
    <template #footer>
      <BaseButton type="primary" @click="formSubmit">提交</BaseButton>
      <BaseButton @click="dialogVisible = false">关闭</BaseButton>
    </template>
  </Dialog>
</template>
