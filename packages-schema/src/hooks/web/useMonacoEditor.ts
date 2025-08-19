/* eslint-disable new-cap */
import { nextTick, onBeforeUnmount, ref } from 'vue';

import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

export function useMonacoEditor(language: string = 'javascript') {
  // 编辑器示例
  let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;
  // 目标元素
  const monacoEditorRef = ref<HTMLElement>();

  // 创建实例
  function createEditor(
    editorOption: monaco.editor.IStandaloneEditorConstructionOptions = {},
  ) {
    if (!monacoEditorRef.value) return;
    monacoEditor = monaco.editor.create(monacoEditorRef.value, {
      // 控制编辑器在用户键入、粘贴、移动或缩进行时是否应自动调整缩进
      autoIndent: 'advanced',
      // 自动布局
      automaticLayout: true,
      // 字体大小
      fontSize: 14,
      // 行号
      lineNumbers: 'on',
      // 是否启用预览图
      minimap: { enabled: true },
      // 初始模型
      model: monaco.editor.createModel('', language),
      // 主键
      multiCursorModifier: 'ctrlCmd',
      // 圆角
      roundedSelection: true,
      // 滚动条
      scrollbar: {
        horizontalScrollbarSize: 8,
        verticalScrollbarSize: 8,
      },
      // tab大小
      tabSize: 2,
      // 主题
      theme: 'vs-dark',
      ...editorOption,
    });
    return monacoEditor;
  }

  // 格式化
  async function formatDoc() {
    await monacoEditor?.getAction('editor.action.formatDocument')?.run();
  }

  // 数据更新
  function updateVal(val: string) {
    nextTick(() => {
      if (getOption(monaco.editor.EditorOption.readOnly)) {
        updateOptions({ readOnly: false });
      }
      monacoEditor?.setValue(val);
      setTimeout(async () => {
        await formatDoc();
      }, 10);
    });
  }

  // 配置更新
  function updateOptions(
    opt: monaco.editor.IStandaloneEditorConstructionOptions,
  ) {
    monacoEditor?.updateOptions(opt);
  }

  // 获取配置
  function getOption(name: monaco.editor.EditorOption) {
    return monacoEditor?.getOption(name);
  }

  // 获取实例
  function getEditor() {
    return monacoEditor;
  }

  function changeLanguage(newLanguage: string) {
    const model = monacoEditor?.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, newLanguage);
    }
  }

  function changeTheme(newTheme: string) {
    monaco.editor.setTheme(newTheme);
  }

  // 页面离开 销毁
  onBeforeUnmount(() => {
    if (monacoEditor) {
      monacoEditor.dispose();
    }
  });

  return {
    changeLanguage,
    changeTheme,
    createEditor,
    formatDoc,
    getEditor,
    getOption,
    monacoEditorRef,
    updateOptions,
    updateVal,
  };
}
