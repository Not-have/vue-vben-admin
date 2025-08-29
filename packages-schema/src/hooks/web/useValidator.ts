import type { FormItemRule } from 'element-plus';

interface LengthRange {
  max: number;
  message?: string;
  min: number;
}

export const useValidator = () => {
  const required = (message?: string): FormItemRule => {
    return {
      message: message || '该项为必填项',
      required: true,
    };
  };

  const lengthRange = (options: LengthRange): FormItemRule => {
    const { max, message, min } = options;

    return {
      max,
      message: message || `长度在 ${min} 到 ${max} 个字符`,
      min,
    };
  };

  const notSpace = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (val?.indexOf(' ') === -1) {
          callback();
        } else {
          callback(new Error(message || '不能包含空格'));
        }
      },
    };
  };

  const notSpecialCharacters = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (/[`~!@#$%^&*()_+<>?:"{},./;'[\]]/.test(val)) {
          callback(new Error(message || '不能包含特殊字符'));
        } else {
          callback();
        }
      },
    };
  };

  const email = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        // 匹配大多数合法邮箱的正则
        const pattern = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        if (val && !pattern.test(val)) {
          callback(new Error(message || '请输入正确的邮箱地址'));
        } else {
          callback();
        }
      },
    };
  };

  return {
    lengthRange,
    notSpace,
    notSpecialCharacters,
    required,
    email,
  };
};
