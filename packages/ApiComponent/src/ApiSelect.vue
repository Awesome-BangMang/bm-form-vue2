<script setup>
import { get, isArray } from 'lodash-es'
import { computed, onMounted, ref, unref, useAttrs, watch } from 'vue'
import {BasicSelect} from '@/BasicSelect'

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
})

const emits = defineEmits(['optionsChange', 'change', 'update'])

const options = ref([])
const isFirstLoaded = ref(false)
const loading = ref(false)

const attrs = useAttrs()

const getAttrs = computed(() => {
  return {
    ...attrs,
    ...(props.api ? { options: unref(options) } : {}),
  }
})

function handleChange(...args) {
  emits('change', ...args)
}

function handleUpdate (...args){
  emits('update', ...args)
}

watch(
  () => props.params,
  () => {
    !unref(isFirstLoaded) && fetch()
  },
  { deep: true }
)

watch(
  () => props.immediate,
  (v) => {
    v && !isFirstLoaded.value && fetch()
  }
)

onMounted(() => {
  props.immediate && fetch()
})

async function fetch() {
  const { api } = props
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
</script>

<template>
  <div class="w-full">
    <BasicSelect v-bind="getAttrs" @change="handleChange" @update="handleUpdate">
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </BasicSelect>
  </div>
</template>
