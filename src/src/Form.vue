<script setup="">
import {computed, getCurrentInstance, nextTick, onMounted, ref, unref, useAttrs, inject, watch} from 'vue'
import {BasicFormProps} from '../props/BasicFormProps.js'
import {useValidate} from '../hooks/useValidate.js'
import {cloneDeep, isFunction} from 'lodash-es'
import {useFormValue} from '../hooks/useFormValue.js'
import {useFormProps} from '../hooks/useFormProps.js'
import {componentMap} from '../componentMap.js'

import FormItem from './FormItem.vue'
import {ElRow, ElForm} from '/element.js'
import {getLabelWidth} from "../utils/helper.js";

const {proxy} = getCurrentInstance()
const props = defineProps(BasicFormProps)
const emits = defineEmits(['register', 'input'])
const attrs = useAttrs()
const formRef = ref()

const {getProps, getRowProps, setProps} = useFormProps(props)
const {formModel, setDefaultValue, setFieldsValue, getFieldsValue} = useFormValue(getProps)
const {validate, validateField} = useValidate(formRef, formModel)

const modalFormDisabled = inject('modalFormDisabled', false)

//hooks的props > props > attrs
const getBindValue = computed(() => {
  return {
    disabled: unref(modalFormDisabled),
    ...attrs,
    ...props,
    ...unref(getProps),
    ref: formRef,
    labelWidth: getLabelWidth(unref(getProps).labelWidth),
  }
})

const getSchemas = computed(() => {
  return unref(getProps)?.schemas?.filter((item) => {
    const {show} = item || {}
    if (!item?.field) console.error('请配置field字段')
    if (!item?.field) console.error(item?.label)
    
    const disabled = item?.disabled || unref(modalFormDisabled)
    
    //show的回调函数传递参数
    const showProps = {formModel: unref(formModel), schema: item, disabled}
    return isFunction(show) ? show(showProps) !== false : item.show !== false
  })
})

const input = async (e, item) => {
  const {field} = item
  proxy.$set(formModel.value, field, e)
  emits('input', cloneDeep(formModel.value))
  try {
    unref(formRef) && (await validateField([field]))
  } catch (e) {
    console.log(e)
  }
}

watch(
   () => props?.value,
   (v) => {
     formModel.value = props.value
   },
   {deep: true, immediate: true}
)

onMounted(async () => {
  await nextTick()
  formModel.value = setDefaultValue()
  Object.assign(formModel.value, props?.value || {})
  proxy.$forceUpdate()
  emits('input', cloneDeep(formModel.value))
  proxy.$forceUpdate()
})

emits('register', {
  setProps,
  validate,
  validateField,
  getFieldsValue,
  setFieldsValue,
  async resetFields() {
    formModel.value = setDefaultValue()
    emits('input', cloneDeep(formModel.value))
    await nextTick()
    await unref(formRef).clearValidate()
  },
  clearValidate() {
    unref(formRef).clearValidate()
  },
})
</script>

<template>
  <ElForm v-bind="getBindValue" :model="formModel" class="px-20px">
    <ElRow v-bind="getRowProps">
      <FormItem
         v-for="item in getSchemas"
         :key="item.field"
         :formModel="formModel"
         :componentMap="componentMap"
         :value="formModel[item?.field]"
         :schema="item"
         :field="item.field"
         :$index="item.field"
         :setFieldsValue="setFieldsValue"
         @input="(e) => input(e, item)"/>
    </ElRow>
  </ElForm>
</template>
