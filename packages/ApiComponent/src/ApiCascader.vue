<script setup="">
import {computed, onMounted, ref, unref, useAttrs, watch} from 'vue'
import {cloneDeep, get, isArray} from 'lodash-es'

const findPathById = (arr = [], id, path = []) => {
  return cloneDeep(arr)?.reduce((acc, item) => {
    if (acc) return acc
    const currentPath = [...path, item.id]
    if (item.id === id) return currentPath
    return item.children ? findPathById(item.children, id, currentPath) : null
  }, null)
}

const props = defineProps({
  immediate: {
    type: Boolean,
    default: true,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  resultField: {
    type: String,
    default: 'data',
  },
  api: {},
  value: {},
  //返回value的格式是否为array 默认true返回数组,根据单个值回显整个路径,可能路径不准确,但是id是唯一的
  arrValue: {
    type: Boolean,
    default: true,
  },
})
const cascader = ref()
const emits = defineEmits(['optionsChange', 'change', 'input', 'update', 'handleChange'])

const options = ref([])
const isFirstLoaded = ref(false)
const loading = ref(false)

const attrs = useAttrs()

const newValue = computed({
  get: () => {
    if (props?.arrValue) return props?.value
    else {
      if (unref(options)?.length > 0) return findPathById(unref(options), props?.value)
      return []
    }
  },
  set: (v) => {
    if (props?.arrValue) return emits('input', v)
    else {
      return emits('input', v[v?.length - 1])
    }
  },
})

const getAttrs = computed(() => {
  return {
    clearable: true,
    ...attrs,
    ...(props.api ? {options: unref(options)} : {}),
  }
})

const handleChange = (v) => {
  emits('handleChange', v)
  if (props?.arrValue) return emits('input', v)
  else {
    return emits('input', v[v?.length - 1])
  }
}

onMounted(() => {
  props.immediate && fetch()
})

async function fetch() {
  const {api} = props
  if (!api) return
  loading.value = true
  options.value = []
  let result
  try {
    result = await api(props.params)
  } catch (e) {
    console.error(e)
  }
  loading.value = false
  if (!result) return
  if (!isArray(result)) {
    result = get(result, props.resultField)
  }
  options.value = result || []
  isFirstLoaded.value = true
  emits('optionsChange', options.value)
}


//解决cascader组件 disabled时面板不会关闭的bug
watch(
   () => getAttrs?.value?.disabled,
   (e) => {
     if (e) {
       cascader.value && (cascader.value.dropDownVisible = false)
     }
   }
)

</script>

<template>
  <div class="api-cascader w-full">
    <ElCascader
       ref="cascader"
       v-model="newValue"
       :options="options"
       @change="handleChange"
       v-bind="getAttrs"
       :disabled="getAttrs?.disabled || loading"
       class="relative w-full">
    </ElCascader>
  </div>
</template>
