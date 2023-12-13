//全局设置默认验证规则 不能为空格
const REGEXP_EMPTY =/.*\S.*/s

export const defaultRules = [
  {
    validator(_, value, callback) {
      if (typeof value === 'string' && !REGEXP_EMPTY?.test(value) && value) {
        callback(new Error('输入内容不能是纯空格'))
      } else callback()
    },
  },
]

