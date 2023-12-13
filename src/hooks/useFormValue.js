import { getCurrentInstance, nextTick, onMounted, ref, unref } from 'vue'
import { cloneDeep } from 'lodash-es'

export const useFormValue = (getProps) => {
  const formModel = ref({}) //保存临时状态
  const { proxy } = getCurrentInstance()

  //遍历schema，设置各项默认值
  const setDefaultValue = () => {
    const { schemas } = unref(getProps)
    const defaultValueObj = {}

    schemas?.forEach((item) => {
      const { field, defaultValue } = item
      if (field) {
        defaultValueObj[field] = defaultValue
      } else {
        defaultValueObj[field] = null
      }
    })

    return defaultValueObj
  }

  /**
   * @description 设置表单每项的值
   * @param formState
   */
  const setFieldsValue = (formState) => {
    for (const k in unref(formState)) {
      proxy?.$set(formModel.value, k, unref(formState)[k])
    }
    proxy?.$emit('input', cloneDeep(formModel.value))
    proxy.$forceUpdate()
  }

  /**
   * @description - 返回表单值
   * @return formModel
   */
  const getFieldsValue = () => {
    return unref(formModel)
  }
  return { formModel, setDefaultValue, setFieldsValue, getFieldsValue }
}
