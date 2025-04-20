import type {
  TableColumn,
  TableExpose,
  TableProps,
  TableSetProps,
} from '#/components/Table';
import type { ComponentRef } from '#/types';

import { nextTick, onMounted, ref, unref, watch } from 'vue';

import { ElMessage, ElMessageBox, ElTable } from 'element-plus';

import { Table } from '#/components/Table';

interface UseTableConfig {
  fetchDataApi: () => Promise<{
    list: any[];
    total?: number;
  }>;
  fetchDelApi?: () => Promise<boolean>;
  /**
   * 是否初始化的时候请求一次
   */
  immediate?: boolean;
}

export const useTable = (config: UseTableConfig) => {
  const { immediate = true } = config;

  const loading = ref(false);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const dataList = ref<any[]>([]);
  let isPageSizeChange = false;

  watch(
    () => currentPage.value,
    () => {
      if (!isPageSizeChange) methods.getList();
      isPageSizeChange = false;
    },
  );

  watch(
    () => pageSize.value,
    () => {
      // 当前页不为1时，修改页数后会导致多次调用getList方法
      if (unref(currentPage) === 1) {
        methods.getList();
      } else {
        currentPage.value = 1;
        isPageSizeChange = true;
        methods.getList();
      }
    },
  );

  onMounted(() => {
    if (immediate) {
      methods.getList();
    }
  });

  // Table实例
  const tableRef = ref<TableExpose & typeof Table>();

  // ElTable实例
  const elTableRef = ref<ComponentRef<typeof ElTable>>();

  const register = (
    ref: TableExpose & typeof Table,
    elRef: ComponentRef<typeof ElTable>,
  ) => {
    tableRef.value = ref;
    elTableRef.value = unref(elRef);
  };

  const getTable = async () => {
    await nextTick();
    const table = unref(tableRef);
    if (!table) {
      console.error(
        'The table is not registered. Please use the register method to register',
      );
    }
    return table;
  };

  const methods = {
    /**
     * @description 新增column
     * @param tableColumn 需要新增数据
     * @param index 在哪里新增
     */
    addColumn: async (tableColumn: TableColumn, index?: number) => {
      const table = await getTable();
      table?.addColumn(tableColumn, index);
    },

    /**
     * @description 删除column
     * @param field 删除哪个数据
     */
    delColumn: async (field: string) => {
      const table = await getTable();
      table?.delColumn(field);
    },

    // sortableChange: (e: any) => {
    //   console.log('sortableChange', e)
    //   const { oldIndex, newIndex } = e
    //   dataList.value.splice(newIndex, 0, dataList.value.splice(oldIndex, 1)[0])
    //   // to do something
    // }
    // 删除数据
    delList: async (idsLength: number) => {
      const { fetchDelApi } = config;
      if (!fetchDelApi) {
        console.warn('fetchDelApi is undefined');
        return;
      }
      ElMessageBox.confirm('是否删除所选中数据？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
      }).then(async () => {
        const res = await fetchDelApi();
        if (res) {
          ElMessage.success('删除成功');

          // 计算出临界点
          let current;
          const totalValue = unref(total);
          const pageSizeValue = unref(pageSize);
          const currentPageValue = unref(currentPage);

          if (totalValue % pageSizeValue === idsLength || pageSizeValue === 1) {
            current =
              currentPageValue > 1 ? currentPageValue - 1 : currentPageValue;
          } else {
            current = currentPageValue;
          }

          currentPage.value = current;
          methods.getList();
        }
      });
    },

    /**
     * @description 获取ElTable组件的实例
     * @returns ElTable instance
     */
    getElTableExpose: async () => {
      await getTable();
      return unref(elTableRef);
    },

    /**
     * 获取表单数据
     */
    getList: async () => {
      loading.value = true;
      try {
        const res = await config?.fetchDataApi();
        // console.log('fetchDataApi res', res);
        if (res) {
          dataList.value = res.list;
          total.value = res.total || 0;
        }
      } catch {
        console.error('fetchDataApi error');
      } finally {
        loading.value = false;
      }
    },

    refresh: () => {
      methods.getList();
    },

    /**
     * @description 设置column
     * @param columnProps 需要设置的列
     */
    setColumn: async (columnProps: TableSetProps[]) => {
      const table = await getTable();
      table?.setColumn(columnProps);
    },

    /**
     * @description 设置table组件的props
     * @param props table组件的props
     */
    setProps: async (props: TableProps = {}) => {
      const table = await getTable();
      table?.setProps(props);
    },
  };

  return {
    tableMethods: methods,
    tableRegister: register,
    tableState: {
      currentPage,
      dataList,
      loading,
      pageSize,
      total,
    },
  };
};
