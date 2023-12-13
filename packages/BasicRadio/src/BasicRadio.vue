<script setup="">
import {computed, useAttrs} from 'vue'
import {ElRadioGroup} from '/element'

const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: '',
  },
  props: {
    type: Object,
    default: () => ({
      label: 'label',
      value: 'value',
    }),
  },
  options: {
    type: Array,
    default: () => [],
  },
})
const emits = defineEmits(['input', 'change'])
const attrs = useAttrs()

const computedOptions = computed(() => {
  return props.options.map((item) => {
    return {
      label: item[props?.props?.label],
      value: item[props?.props?.value],
      disabled: item?.disabled,
    }
  })
})

const radioOptions = computed(() => {
  return {
    ...attrs,
    ...props,
  }
})

const change = (e) => {
  emits('input', e)
}

</script>

<template>
  <div>
    <ElRadioGroup v-bind="radioOptions" :value="value" @input="change">
      <ElRadio v-for="item in computedOptions" :label="item.value" :key="item.value" :disabled="item?.disabled">
        {{ item.label }}
      </ElRadio>
    </ElRadioGroup>
  </div>
</template>
