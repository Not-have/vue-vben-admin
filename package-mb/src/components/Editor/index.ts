import type { IDomEditor } from '@wangeditor/editor';

export interface EditorExpose {
  getEditorRef: () => Promise<IDomEditor>;
}

export { default as Editor } from './src/Editor.vue';
