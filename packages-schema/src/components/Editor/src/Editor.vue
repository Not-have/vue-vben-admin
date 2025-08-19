<script setup lang="ts">
import type { IDomEditor, IEditorConfig } from '@wangeditor/editor';

import type { PropType } from 'vue';

import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  unref,
  watch,
} from 'vue';

import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { ElMessage } from 'element-plus';

import { isNumber } from '#/utils/is';
import { propTypes } from '#/utils/propTypes';

const props = defineProps({
  editorConfig: {
    default: () => undefined,
    type: Object as PropType<IEditorConfig>,
  },
  editorId: propTypes.string.def('wangeEditor-1'),
  height: propTypes.oneOfType([Number, String]).def('500px'),
  modelValue: propTypes.string.def(''),
});

const emit = defineEmits(['change', 'update:modelValue']);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>();

const valueHtml = ref('');

watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueHtml)) return;
    valueHtml.value = val;
  },
);

// 监听
watch(
  () => valueHtml.value,
  (val: string) => {
    emit('update:modelValue', val);
  },
);

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
  valueHtml.value = props.modelValue;
};

// 编辑器配置
const editorConfig = computed((): IEditorConfig => {
  return Object.assign(
    {
      autoFocus: false,
      customAlert: (s: string, t: string) => {
        switch (t) {
          case 'error': {
            ElMessage.error(s);
            break;
          }
          case 'info': {
            ElMessage.info(s);
            break;
          }
          case 'success': {
            ElMessage.success(s);
            break;
          }
          case 'warning': {
            ElMessage.warning(s);
            break;
          }
          default: {
            ElMessage.info(s);
            break;
          }
        }
      },
      readOnly: false,
      scroll: true,
      uploadImgShowBase64: true,
    },
    props.editorConfig || {},
  );
});

const editorStyle = computed(() => {
  return {
    height: isNumber(props.height) ? `${props.height}px` : props.height,
  };
});

// 回调函数
const handleChange = (editor: IDomEditor) => {
  emit('change', editor);
};

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = unref(editorRef.value);

  // 销毁，并移除 editor
  editor?.destroy();
});

const getEditorRef = async (): Promise<IDomEditor> => {
  await nextTick();
  return unref(editorRef.value) as IDomEditor;
};

defineExpose({
  getEditorRef,
});
</script>

<template>
  <div class="border-1 z-10 border-solid border-[var(--el-border-color)]">
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      :editor-id="editorId"
      class="b-b-1 border-0 border-solid border-[var(--el-border-color)]"
    />
    <!-- 编辑器 -->
    <Editor
      v-model="valueHtml"
      :editor-id="editorId"
      :default-config="editorConfig"
      :style="editorStyle"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
