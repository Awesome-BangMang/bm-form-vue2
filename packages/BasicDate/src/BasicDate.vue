<script setup="">
import {computed, ref, useAttrs} from 'vue'
import {ElDatePicker} from '/element'

const props = defineProps({
  value: {
    type: [String, Date],
    default: '',
  },
})
const emits = defineEmits(['input'])
const attrs = useAttrs()

const dateOptions = computed(() => {
  return {
    ...attrs,
    ...props,
  }
})

const value = computed({
  get() {
    return props.value
  },
  set(value) {
    emits('input', value)
  },
})
</script>

<template>
  <div>
    <ElDatePicker v-bind="dateOptions" v-model="value"/>
  </div>
</template>
