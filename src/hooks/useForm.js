import { getCurrentInstance, nextTick, onUnmounted, ref, unref, watch } from 'vue'

export const useForm = (props) => {
  const formRef = ref()
  const { proxy } = getCurrentInstance()

  async function getForm() {
    const formMethods = unref(formRef)
    await nextTick()
    return formMethods
  }

  function register(instance) {
    onUnmounted(() => {
      formRef.value = null
    })
    formRef.value = instance
    watch(
      () => unref(props),
      () => {
        props && instance?.setProps(unref(props))
      },
      {
        immediate: true,
        // deep: true,
      }
    )
  }

  const methods = {
    /**
     * @description - 验证表单,同时返回表单数据
     * @return {Promise<formModel>}
     */
    validate: async () => {
      return await unref(formRef).validate()
    },
    validateField: async (fields) => {
      return await unref(formRef).validateField(fields)
    },
    /**
     * @description - 重置表单
     * @return {*}
     */
    resetFields: async () => {
      await nextTick()
      await unref(formRef)?.resetFields()
      proxy?.$forceUpdate()
    },
    /**
     * @description 设置表单字段值
     */
    setFieldsValue: async (formState) => {
      await nextTick()
      await unref(formRef).setFieldsValue(formState)
      await unref(formRef).clearValidate()
    },
    /**
     * @description 获取表单字段值
     * @return {Promise<void>}
     */
    getFieldsValue: async () => {
      await nextTick()
      await unref(formRef)?.validate()
      return await unref(formRef)?.getFieldsValue()
    },
  }
  return [register, methods]
}
