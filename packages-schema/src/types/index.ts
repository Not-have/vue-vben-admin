export interface Fn<T = any> {
  (...arg: T[]): T;
}

export type Nullable<T> = null | T;
export type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
export type Recordable<
  T = any,
  K extends number | string | symbol = string,
> = Record<K extends null | undefined ? string : K, T>;
export type ComponentRef<T extends abstract new (...args: any) => any> =
  InstanceType<T>;

export type TimeoutHandle = ReturnType<typeof setTimeout>;
export type IntervalHandle = ReturnType<typeof setInterval>;

export type ElementPlusInfoType = 'danger' | 'info' | 'success' | 'warning';
export type LayoutType = 'classic' | 'cutMenu' | 'top' | 'topLeft';

export type AxiosContentType =
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain';
export type AxiosMethod = 'delete' | 'get' | 'post' | 'put';
export type AxiosResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'stream'
  | 'text';

export interface AxiosConfig {
  data?: any;
  headers?: any; // 这里需要替换为正确的类型，例如 RawAxiosRequestHeaders
  method?: AxiosMethod;
  params?: any;
  responseType?: AxiosResponseType;
  url?: string;
}

export interface IResponse<T = any> {
  code: number;
  data: T extends any ? T : any & T;
}

export interface ThemeTypes {
  elColorPrimary?: string;
  leftMenuBgActiveColor?: string;
  leftMenuBgColor?: string;
  leftMenuBgLightColor?: string;
  leftMenuBorderColor?: string;
  leftMenuCollapseBgActiveColor?: string;
  leftMenuTextActiveColor?: string;
  leftMenuTextColor?: string;
  logoBorderColor?: string;
  logoTitleTextColor?: string;
  topHeaderBgColor?: string;
  topHeaderHoverColor?: string;
  topHeaderTextColor?: string;
  topToolBorderColor?: string;
}
