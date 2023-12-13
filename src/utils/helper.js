import {isFunction} from 'lodash-es'
import {unref} from "vue";
import {defaultRules} from "../setting/rules.js";

/** 解析字段值，如果字段值是函数，则执行并返回结果，否则直接返回字段值 */
export const resolveFieldValue = (value, callBackValue) => {
  if (isFunction(value)) {
    return value(unref(callBackValue));
  }
  return value
}

/** 创建表单项的校验规则，合并传入的规则和默认规则*/
export const createFormItemRules = (rules = [], component = 'Input', label) => {
  const hasRequiredRule = rules?.find(item => item?.required)
  if (!!hasRequiredRule && !hasRequiredRule?.message) {
    hasRequiredRule.message = `${createPlaceholderMessage(component)}${label}`
  }
  return [...rules, ...defaultRules]
}

/** 获取标签宽度的样式，将标签宽度转换为带有单位的样式字符串*/
export const getLabelWidth = (labelWidth) => {
  if (!labelWidth) return labelWidth
  if (typeof labelWidth === 'string') return labelWidth.includes('px') ? labelWidth : `${labelWidth}px`
  if (typeof labelWidth === 'number') return `${labelWidth}px`
}

/** 创建表单项的占位消息，根据组件类型生成不同的占位消息*/
export const createPlaceholderMessage = (component = '') => {
  if (!component) return ''
  if (typeof component !== 'string') return ''
  if (component?.includes('Input') || component?.includes('Complete')) {
    return '请输入'
  }
  if (component?.includes('Date')) {
    return '请选择日期'
  }
  if (component?.includes('Picker')) {
    return '请选择'
  }
  if (
    component?.includes('Select') ||
    component?.includes('Cascader') ||
    component?.includes('Checkbox') ||
    component?.includes('Radio') ||
    component?.includes('Switch')
  ) {
    return '请选择'
  }
  return ''
}
