<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable no-console -->
<script setup lang="tsx">
import type { TableColumn } from 'mb-admin/components/Table';
import type { Recordable } from 'mb-admin/types';

import { h, ref } from 'vue';

import { ElTag } from 'element-plus';
import { BaseButton } from 'mb-admin/components/Button';
import { ContentWrap } from 'mb-admin/components/ContentWrap';
import { Table } from 'mb-admin/components/Table';

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
</template>
