<script setup="">
import {computed, ref, useAttrs, watchEffect} from 'vue'
import {ElCheckbox, ElCheckboxGroup} from '/element'

const props = defineProps({
  value: {
    type: [String, Number, Array],
    default: () => [],
  },
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
})
const emits = defineEmits(['input', 'change', 'changeItem'])
const attrs = useAttrs()

const computedOptions = computed(() => {
  return props.options.map((item) => {
    return {
      label: item[props?.props?.label],
      value: item[props?.props?.value],
      disabled: item[props?.props?.disabled]
    }
  })
})

const checkOptions = computed(() => {
  return {
    ...attrs,
    ...props,
  }
})

const change = (e) => {
  emits('input', e)
  emits('change', e)
}

const changeItem = (e, value) => {
  emits('changeItem', {
    checked: e,
    value: value,
  })
}
const checkList = ref([])

watchEffect(() => {
  checkList.value = props.value
})

</script>

<template>
  <ElCheckboxGroup v-bind="checkOptions" v-model="checkList" @change="change" class="min-h-37px w-full">
    <ElCheckbox v-for="item in computedOptions"
                :key="item.value"
                :label="item.value"
                :disabled="item?.disabled"
                @change="(e) => changeItem(e, item.value)"
    >
      {{ item.label }}
    </ElCheckbox>
  </ElCheckboxGroup>
</template>
