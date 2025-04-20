<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable unicorn/no-nested-ternary -->
<!-- eslint-disable no-console -->
<script setup lang="tsx">
import type { TableColumn, TableSlotDefault } from '@vben/mb/components/Table';

import { onMounted, reactive, ref, unref } from 'vue';

import { BaseButton } from '@vben/mb/components/Button';
import { ContentWrap } from '@vben/mb/components/ContentWrap';
import { Table } from '@vben/mb/components/Table';
import { useTable } from '@vben/mb/hooks/web/useTable';

import { getExampleTableApi } from '#/api/core/table';

const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState;

    const res = await getExampleTableApi({
      page: unref(currentPage),
      pageSize: unref(pageSize),
    });

    return {
      list: res.items,
      total: res.total,
    };
  },
});

const { loading, dataList, total, currentPage, pageSize } = tableState;
const { setProps, setColumn, getElTableExpose, addColumn, delColumn, refresh } =
  tableMethods;

const columns = reactive<TableColumn[]>([]);

onMounted(() => {
  setTimeout(() => {
    setProps({
      columns: [
        {
          field: 'description',
          label: '描述',
        },
        {
          field: 'action',
          label: '操作',
          slots: {
            default: (data: TableSlotDefault) => {
              return (
                <BaseButton onClick={() => actionFn(data)} type="primary">
                  操作
                </BaseButton>
              );
            },
          },
        },
      ],
    });
  }, 2000);
});

const actionFn = (data: TableSlotDefault) => {
  console.log(data);
};

const canShowPagination = ref(true);
const showPagination = (show: boolean) => {
  canShowPagination.value = show;
};

const reserveIndex = (custom: boolean) => {
  setProps({
    reserveIndex: custom,
  });
};

const showSelections = (show: boolean) => {
  setColumn([
    {
      field: 'selection',
      path: 'hidden',
      value: !show,
    },
  ]);
};

const index = ref(1);

const changeTitle = () => {
  setColumn([
    {
      field: 'title',
      path: 'label',
      value: `标题${unref(index)}`,
    },
  ]);
  index.value++;
};

const showExpandedRows = (show: boolean) => {
  setColumn([
    {
      field: 'expand',
      path: 'hidden',
      value: !show,
    },
  ]);
};

const selectAllNone = async () => {
  const elTableRef = await getElTableExpose();
  elTableRef?.toggleAllSelection();
};

const showAction = ref(true);
const delOrAddAction = () => {
  if (unref(showAction)) {
    delColumn('action');
    showAction.value = false;
  } else {
    addColumn({
      field: 'action',
      label: '操作',
      slots: {
        default: (data: TableSlotDefault) => {
          return (
            <BaseButton onClick={() => actionFn(data)} type="primary">
              操作
            </BaseButton>
          );
        },
      },
    });
    showAction.value = true;
  }
};

const showStripe = ref(false);
const showOrHiddenStripe = () => {
  setProps({
    stripe: !unref(showStripe),
  });
  showStripe.value = !unref(showStripe);
};

const height = ref<number | string>('auto');
const fixedHeaderOrAuto = () => {
  if (unref(height) === 'auto') {
    setProps({
      height: 300,
    });
    height.value = 300;
  } else {
    setProps({
      height: 'auto',
    });
    height.value = 'auto';
  }
};

const getSelections = async () => {
  const elTableRef = await getElTableExpose();
  const selections = elTableRef?.getSelectionRows();
  console.log(selections);
};
</script>

<template>
  <ContentWrap title="UseTable 操作" style="margin-bottom: 20px">
    <BaseButton @click="showPagination(true)"> 显示 分页 </BaseButton>
    <BaseButton @click="showPagination(false)"> 隐藏 分页 </BaseButton>

    <BaseButton @click="reserveIndex(true)">叠加序号</BaseButton>
    <BaseButton @click="reserveIndex(false)">还原序号</BaseButton>

    <BaseButton @click="showSelections(true)">显示多选</BaseButton>
    <BaseButton @click="showSelections(false)">隐藏多选</BaseButton>

    <BaseButton @click="changeTitle">修改标题</BaseButton>

    <BaseButton @click="showExpandedRows(true)">显示展开行</BaseButton>
    <BaseButton @click="showExpandedRows(false)">隐藏展开行</BaseButton>

    <BaseButton @click="selectAllNone">全选/全不选</BaseButton>

    <BaseButton @click="delOrAddAction">删除/添加操作列</BaseButton>

    <BaseButton @click="showOrHiddenStripe">显示/隐藏斑马纹</BaseButton>

    <BaseButton @click="fixedHeaderOrAuto">固定头部/自动</BaseButton>

    <BaseButton @click="getSelections">获取多选数据</BaseButton>

    <!-- <BaseButton @click="showOrHiddenSortable">{{ t('tableDemo.showOrHiddenSortable') }}</BaseButton> -->
  </ContentWrap>
  <ContentWrap title="UseTable 示例">
    <Table
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
      show-action
      show-summary
      default-expand-all
      :columns="columns"
      row-key="id"
      :data="dataList"
      :loading="loading"
      :pagination="
        canShowPagination
          ? {
              total,
            }
          : undefined
      "
      @register="tableRegister"
      @refresh="refresh"
    />
  </ContentWrap>
</template>

<style lang="less" scoped>
.el-button {
  margin-top: 10px;
}
</style>
