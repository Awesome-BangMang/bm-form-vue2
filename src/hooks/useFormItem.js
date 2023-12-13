import {computed, unref} from "vue";
import {resolveFieldValue} from "../utils/helper.js";

export const useFormItem = (props) => {
  
  const callBackProps = computed(() => {
    const {componentMap,...rest} = props
    return rest
  })
  
  /** 获取动态disabled*/
  const getDisabled = computed(() => {
    //组件 | 组件 props | form 外层 只要配置了disabled那就不能选择
    const schemaDisabled = resolveFieldValue(props?.schema?.disabled, callBackProps)
    return !!props?.schema?.props?.disabled || schemaDisabled || props?.disabled
  })
  
  /** 获取动态回调值*/
  const callBackValue = computed(() => ({disabled: unref(getDisabled), ...unref(callBackProps)}))
  
  return {getDisabled, callBackValue}
}
