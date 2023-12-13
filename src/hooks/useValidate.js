import { getCurrentInstance, nextTick, unref } from 'vue'

export const useValidate = (formRef, formModel = {}) => {
  const { proxy } = getCurrentInstance()
  /**
   * @description - 验证函数
   * @return {Promise<unknown>}
   */
  const validate = () => {
    if (!unref(formRef)) {
      console.error('未获取到表单实例')
      return Promise.reject(new Error('未获取到表单实例'))
    }
    return new Promise((resolve, reject) => {
      unref(formRef).validate((valid, object) => {
        if (valid) {
          return resolve(unref(formModel), object)
        } else {
          return reject('表单验证失败')
        }
      })
    })
  }
  /**
   * @description - 验证函数
   * @return {Promise<unknown>}
   */
  const validateField = (fields) => {
    if (!unref(formRef)) console.error('未获取到表单实例')
    return new Promise((resolve, reject) => {
      unref(formRef).validateField(fields, (valid) => {
        if (!valid) {
          return resolve(unref(formModel))
        } else {
          return reject('表单验证失败')
        }
      })
    })
  }

  return { validate, validateField }
}
