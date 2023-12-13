<script setup="">
import {computed, unref,} from 'vue'
import {createFormItemRules, createPlaceholderMessage, getLabelWidth, resolveFieldValue} from '../utils/helper.js'
import {ElFormItem, ElCol, ElTooltip} from '/element.js'
import {BasicFormItemProps} from "../props/BasicFormItemProps";
import {useFormItem} from "../hooks/useFormItem.js";

const emits = defineEmits(['input'])
const props = defineProps(BasicFormItemProps)

const {getDisabled, callBackValue} = useFormItem(props)

//渲染动态组件
const getComponent = () => {
  const {componentMap, schema} = props
  const {component} = schema || {}
  if (!component) return unref(componentMap).get('Input')
  return unref(componentMap)?.has(component) ? unref(componentMap)?.get(component) : component
}

/** 获取动态FormItem的属性*/
const getFormItemProps = computed(() => {
  let {labelWidth, rules, field, label, component, ...rest} = props?.schema || {}
  rules = resolveFieldValue(rules, callBackValue)
  
  return {
    ...rest,
    label,
    prop: field,
    labelWidth: getLabelWidth(labelWidth),
    rules: createFormItemRules(rules, component, label)
  }
})

/** 获取动态组件的属性*/
const getComponentProps = computed(() => {
  const {value, schema, formModel, field: formItemField, componentMap} = props
  const {component = 'Input'} = schema || {}
  
  const newProps = resolveFieldValue(schema?.props, callBackValue)
  const disabled = unref(getDisabled)
  return {
    class: 'flex-1',
    ...newProps,
    value,
    formModel,
    disabled,
    formItemField,
    componentMap,
    placeholder: createPlaceholderMessage(component),
  }
})

/** 获取动态词缀*/
const getAffix = (type) => {
  const schema = props?.schema || {}
  return resolveFieldValue(schema[type], callBackValue)
}

/** 获取动态事件*/
const getEvents = computed(() => {
  const eventCallbackValue = {...unref(callBackValue), setFieldsValue: props?.setFieldsValue}
  const events = resolveFieldValue(props?.schema?.events, eventCallbackValue) || {}
  return {
    ...events,
    input: (e) => emits('input', e),
  }
})
</script>

<template>
  <ElCol v-if="props?.schema" :span="props?.schema?.span">
    <ElFormItem v-bind="getFormItemProps">
      <template #label>
        <span>
          {{ getFormItemProps?.label }}
          <ElTooltip class="item" effect="dark" :content="props?.schema?.helpMessage" placement="top">
            <i class="el-icon-question cursor-pointer" v-if="props?.schema?.helpMessage"/>
          </ElTooltip>
          {{ getFormItemProps?.label && ':' }}
        </span>
      </template>
      <div v-if="getAffix('prefix')">{{ getAffix('prefix') }}</div>
      <component v-bind="getComponentProps" v-on="getEvents" :is="getComponent()"/>
      <div class="ml-6px" v-if="getAffix('suffix')">{{ getAffix('suffix') }}</div>
    </ElFormItem>
  </ElCol>
</template>

<style lang="scss" scoped>
:deep(.el-form-item) {
  .el-form-item__content {
    display: flex;
    
    .el-cascader,
    .el-input,
    .el-input-number {
      > input {
        min-height: 32px !important;
      }
      
      width: 100%;
    }
  }
}
</style>
