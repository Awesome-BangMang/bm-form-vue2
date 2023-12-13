<script setup="">
import {computed, inject, unref, useAttrs} from 'vue'
import {useFormList} from '../hooks/useFormList.js'
import {useFormProps} from '../hooks/useFormProps.js'
import {FormListProps} from '../props/FormListProps.js'
import {cloneDeep, isFunction} from 'lodash-es'
import FormItem from './FormItem.vue'


const props = defineProps(FormListProps)
const emits = defineEmits(['input', 'change'])
const attrs = useAttrs()
const modalFormDisabled = inject('modalFormDisabled')

const {addItem, deleteItem, clearAll} = useFormList(props)
const {getProps, getRowProps} = useFormProps(props)

const getSchemas = computed(() => {
  const filterSchemas = unref(getProps)?.schemas?.filter((item) => {
    const {show} = item || {}
    if (!item?.field) console.warn(item?.label, '请配置field字段')
    
    const disabled = item?.disabled || unref(modalFormDisabled)
    
    //show的回调函数传递参数
    const showProps = {formModel: unref(attrs?.formModel), schema: item, disabled}
    return isFunction(show) ? show(showProps) !== false : item.show !== false
  })
  
  return filterSchemas?.map((item) => ({
    ...item,
    labelWidth: unref(getProps)?.labelWidth,
    fieldValue: item?.field, // 替换原本的field,field需要添加index和父组件的field用于表单验证
  }))
})

const input = (e, schema, index) => {
  const value = cloneDeep(props?.value)
  const {fieldValue} = schema
  value[index][fieldValue] = e
  
  emits('input', value)
}


</script>

<template>
  <div>
    <el-button @click="addItem" type="primary">新增</el-button>
    <el-button @click="clearAll()">一键清除</el-button>
    <el-card shadow="never" v-for="(item, index) in props.value" :key="index" class="my-16px">
      <div class="flex justify-end mb-16px">
        <el-button type="text" @click="clearAll(index)">清空</el-button>
        <el-button type="text" @click="deleteItem(index)" v-if="index !== 0" class="text-red-400">删除</el-button>
      </div>
      <el-row v-bind="getRowProps">
        <FormItem
           :componentMap="props?.componentMap"
           v-for="schema in getSchemas"
           :formModel="attrs?.formModel"
           :value="item[schema?.fieldValue]"
           :$index="index"
           :key="item?.field"
           :schema="{ ...schema, field: `${props?.formItemField}.${index}.${schema.field}`}"
           @input="(e) => input(e, schema, index)"/>
      </el-row>
    </el-card>
  </div>
</template>
