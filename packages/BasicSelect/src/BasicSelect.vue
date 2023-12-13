<script setup>
import {computed, useAttrs} from 'vue'
import {ElTooltip,ElOption,ElSelect} from '/element'

const attrs = useAttrs()
const emits = defineEmits(['input', 'change', 'update'])
const props = defineProps({
  props: {
    type: Object,
    default: () => ({
      label: 'label',
      value: 'value',
      disabled: 'disabled',
    }),
  },
  options: {
    type: Array,
    default: () => [],
  },
  value: {
    type: [String, Number, Array],
  },
})

const change = (e) => {
  emits('input', e)
  emits('change', e, props?.options)
}

const computedOptions = computed(() => {
  const {label = 'label', value = 'value', disabled = 'disabled'} = props?.props || {}
  return props?.options?.map((item) => {
    return {
      label: item[label],
      value: item[value],
      disabled: item[disabled],
    }
  })
})

const selectProps = computed(() => {
  return {
    clearable: true,
    filterable: true,
    ...attrs,
    ...props,
  }
})
</script>

<template>
  <div class="relative">
    <ElTooltip v-if="attrs.multiple" placement="top" effect="light">
      <ElSelect
         v-if="attrs.multiple"
         v-bind="selectProps"
         tags
         :value="value"
         @change="change"
         placeholder="请选择"
         class="w-full"
         filterable>
        <ElOption
           v-for="item in computedOptions"
           :key="item.value"
           :label="item.label"
           :value="item.value"
           :disabled="item.disabled"/>
      </ElSelect>
      <template #content>
        <div class="flex flex-wrap max-w-300px">
          <div
             v-for="(i, index) in value"
             :key="index"
             class="text-[13px] p-[4px] mr-3px mb-4px border px-3px text-[#909399] border-[#e9e9eb] rounded-[4px] bg-[#f4f4f5]">
            {{ computedOptions.find((item) => item.value === i)?.label }}
          </div>
        </div>
      </template>
    </ElTooltip>
    
    <ElSelect
       v-bind="selectProps"
       :value="value"
       collapse-tags
       @change="change"
       placeholder="请选择"
       v-else
       class="w-full">
      <ElOption
         v-for="item in computedOptions"
         :key="item.value"
         :label="item.label"
         :value="item.value"
         :disabled="item.disabled"></ElOption>
    </ElSelect>
  </div>
</template>
