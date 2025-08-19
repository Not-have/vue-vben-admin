export interface ContextMenuSchema {
  command?: (item: ContextMenuSchema) => void;
  disabled?: boolean;
  divided?: boolean;
  icon?: string;
  label: string;
}
