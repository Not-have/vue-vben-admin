export interface JsonEditorProps {
  collapsedOnClickBrackets?: boolean;
  deep?: number;
  editable?: boolean;
  editableTrigger?: 'click' | 'dblclick';
  height?: number;
  highlightSelectedNode?: boolean;
  itemHeight?: number;
  nodeSelectable?: (...args: any[]) => boolean;
  renderNodeKey?: (...args: any[]) => any;
  renderNodeValue?: (...args: any[]) => any;
  rootPath?: string;
  selectableType?: 'multiple' | 'single';
  selectOnClickNode?: boolean;
  showDoubleQuotes?: boolean;
  showIcon?: boolean;
  showLength?: boolean;
  showLineNumber?: boolean;
  showLineNumbers?: boolean;
  showSelectController?: boolean;
  value: any;
  virtual?: boolean;
}
