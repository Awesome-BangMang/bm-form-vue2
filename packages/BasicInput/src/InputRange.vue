<script setup>
import {cloneDeep} from 'lodash-es'
import {computed} from 'vue'
import {ElInput} from '/element'

const props = defineProps({
  value: {},
  type: {
    type: String,
    default: 'number',
  },
  precision: Number,
  min: Number,
})
const emits = defineEmits(['input', 'change'])

const isNumStr = (str) => /^-?\d*(\.\d+)?$/.test(str)

const isNegativeNumberStr = (str) => {
  return str?.toString().startsWith('-')
}

const isBigger = (e) => {
  if ([null, undefined, '']?.includes(props?.min)) return true
  if ([null, undefined, '']?.includes(e)) return true
  return Number(e) >= props?.min
}

const compareNumber = (e, index) => {
  if (props?.type !== 'number') return true
  if (!e) return true
  return true
}

const changeInput = (e, index) => {
  const isNumber = props.type === 'number' && isNumStr(e || '')
  const [start = '', end = ''] = cloneDeep(props.value) || []
  const newArr = [start, end]
  const oldVal = newArr[index]
  const pass = compareNumber(e, index)
  
  newArr[index] = isNumber && pass && !isNegativeNumberStr(e) && isBigger(e) ? e : oldVal
  emits('input', newArr)
  emits('change', newArr)
}

const getInputValue = (index) => {
  const inputValue = props.value && props.value.length === 2 ? props.value[index] || '' : ''
  if (!isNumStr(inputValue)) changeInput('', index)
  return inputValue
}

const leftValue = computed({
  get: () => getInputValue(0),
  set: (val) => changeInput(val, 0),
})

const rightValue = computed({
  get: () => getInputValue(1),
  set: (val) => changeInput(val, 1),
})
</script>

<template>
  <div class="flex gap-8px w-full">
    <ElInput v-model="leftValue"/>
    -
    <ElInput v-model="rightValue"/>
  </div>
</template>
