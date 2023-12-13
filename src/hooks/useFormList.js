import { cloneDeep } from 'lodash-es'
import { getCurrentInstance } from 'vue'
import { useFormValue } from "../hooks/useFormValue.js";

export const useFormList = (props) => {
  const { proxy } = getCurrentInstance()

  const {setDefaultValue} = useFormValue(props)
  /**
   * @description 新增
   */
  const addItem = () => {
    const value = cloneDeep(props?.value)
    value?.push(setDefaultValue())
    console.log(value);
    proxy?.$emit('input', value)
  }

  /**
   * @description 删除
   */
  const deleteItem = (index) => {
    const value = cloneDeep(props?.value)
    value?.splice(index, 1)
    proxy?.$emit('input', value)
  }

  /**
   * @description 清空
   */
  const clearAll = (index = null) => {
    const value = cloneDeep(props?.value)
    if (index === null) {
      value?.forEach((item, index) => {
        for (const k in value[index]) value[index][k] = null
      })
    } else {
      for (const k in value[index]) {
        value[index][k] = null
      }
    }

    proxy?.$emit('input', value)
  }

  return { addItem, deleteItem, clearAll }
}
