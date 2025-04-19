<script lang="tsx">
import type { ComponentSize } from 'element-plus';

import type { PropType } from 'vue';

import type { TableColumn } from '../types';

import { computed, defineComponent, ref, unref } from 'vue';

import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';

import { Icon } from '#/components/Icon';

import ColumnSetting from './ColumnSetting.vue';

export default defineComponent({
  components: {
    ColumnSetting,
  },
  emits: ['refresh', 'changSize', 'confirm'],
  name: 'TableActions',
  props: {
    columns: {
      default: () => [],
      type: Array as PropType<TableColumn[]>,
    },
  },
  setup(props, { emit }) {
    // TODO : 这里的sizeMap需要根据实际情况来设置
    const sizeMap = computed(() => ['default', 'large', 'small']);
    const showSetting = ref(false);

    const refresh = () => {
      emit('refresh');
    };

    const changSize = (size: ComponentSize) => {
      emit('changSize', size);
    };

    const confirm = (columns: TableColumn[]) => {
      emit('confirm', columns);
    };

    const showColumnSetting = () => {
      showSetting.value = true;
    };

    return () => (
      <>
        <div class="h-28px flex items-center justify-end text-right">
          <div
            class="w-30px h-20px flex items-center justify-end"
            onClick={refresh}
            title="刷新"
          >
            <Icon
              class="cursor-pointer"
              hover-color="var(--el-color-primary)"
              icon="ant-design:sync-outlined"
            />
          </div>

          <ElDropdown onCommand={changSize} trigger="click">
            {{
              default: () => {
                return (
                  <div
                    class="w-30px h-20px flex items-center justify-end"
                    title="尺寸"
                  >
                    <Icon
                      class="cursor-pointer"
                      hover-color="var(--el-color-primary)"
                      icon="ant-design:column-height-outlined"
                    />
                  </div>
                );
              },
              dropdown: () => {
                return (
                  <ElDropdownMenu>
                    {{
                      default: () => {
                        return unref(sizeMap).map((v) => {
                          return (
                            <ElDropdownItem command={v} key={v}>
                              {v}
                            </ElDropdownItem>
                          );
                        });
                      },
                    }}
                  </ElDropdownMenu>
                );
              },
            }}
          </ElDropdown>

          <div
            class="w-30px h-20px flex items-center justify-end"
            onClick={showColumnSetting}
            title="列设置"
          >
            <Icon
              class="cursor-pointer"
              hover-color="var(--el-color-primary)"
              icon="ant-design:setting-outlined"
            />
          </div>
        </div>
        <ColumnSetting
          columns={props.columns}
          onConfirm={confirm}
          v-model={showSetting.value}
        />
      </>
    );
  },
});
</script>
