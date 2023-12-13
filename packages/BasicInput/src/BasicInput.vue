<script setup="">
import {computed, getCurrentInstance, useAttrs, useSlots} from 'vue'
import {ElInput} from '/element'

const {proxy} = getCurrentInstance()
const props = defineProps({
  value: {
    type: [String, Number],
    default: '',
  },
})

const emits = defineEmits(['input'])
const attrs = useAttrs()
const slots = useSlots()

const getDefaultSetting = (attrs) => {
  let {type} = attrs
  let maxlength = 50
  if (type === 'textarea') maxlength = 300
  return {
    showWordLimit: true,
    maxlength,
  }
}

const getProps = computed(() => {
  const defaultSetting = getDefaultSetting(attrs)
  return {...defaultSetting, ...attrs, ...props,}
})

const newValue = computed({
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
    <ElInput v-model="newValue" v-bind="getProps" v-on="proxy?.$listeners">
      <template #[item]="data" v-for="item in Object.keys(slots)">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </ElInput>
  </div>
</template>
