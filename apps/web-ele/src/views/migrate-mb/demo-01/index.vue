<!-- eslint-disable prettier/prettier -->
<script setup lang="tsx">
import type { TableColumn } from '@vben/mb/components/Table';
import type { Recordable } from '@vben/mb/types';

import { h, ref } from 'vue';

import { BaseButton } from '@vben/mb/components/Button';
import { ContentWrap } from '@vben/mb/components/ContentWrap';
import { Table } from '@vben/mb/components/Table';

import { ElTag } from 'element-plus';

import dataFetch from '../mock/mock-01.json';

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
        // eslint-disable-next-line unicorn/no-nested-ternary
        () => (cellValue === 1 ? '重要' : cellValue === 2 ? '良好' : '一般'),
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

const loading = ref(false);

const tableDataList = ref<any>([]);

const getTableList = () => {
  tableDataList.value = dataFetch.data.list;
};

getTableList();

const actionFn = (data: any) => {
  // eslint-disable-next-line no-console
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
