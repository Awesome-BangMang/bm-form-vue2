import { merge } from 'lodash-es'
import { computed, ref, unref } from 'vue'

export const useFormProps = (props) => {
  const propsRef = ref()

  const setProps = async (formProps = {}) => {
    propsRef.value = merge(unref(propsRef) || {}, unref(formProps))
  }

  const getProps = computed(() => ({
    ...props,
    ...unref(propsRef),
  }))

  const getRowProps = computed(() => {
    const { gutter } = unref(getProps)
    return {
      gutter,
    }
  })

  return { propsRef, getProps, getRowProps, setProps }
}
