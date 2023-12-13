<script setup>
import {computed, getCurrentInstance, nextTick, onMounted, onUnmounted, provide, ref, unref, useAttrs} from 'vue'
import {ElDialog} from '/element'

const props = defineProps({
  footer: {
    default: true,
  },
  disabled: {
    default: false,
  },
  confirmLoading: {
    default: false,
    type: Boolean,
  },
})

const emits = defineEmits(['register', 'ok', 'close', 'closed'])

const attrs = useAttrs()
const propsRef = ref()

const loading = ref(false)
const disabled = ref(false)
const dialog = ref()

provide('modalFormDisabled', disabled)

const observer = ref()
const innerBox = ref()
const wrapperBox = ref()
const visible = ref(false)
const {proxy} = getCurrentInstance()

const propsData = computed(() => {
  return {
    ...attrs,
    ...unref(propsRef),
  }
})

const getFooterProps = computed(() => {
  let {footer = true} = unref(propsData)
  return {footer: props?.footer && footer}
})

const methods = {
  openModal: async (props = {title: ''}) => {
    observer.value && observer.value?.disconnect()
    if (wrapperBox?.value?.style?.height) wrapperBox.value.style.height = 'auto'
    visible.value = true
    propsRef.value = props
    
    await nextTick()
    if (innerBox.value) {
      observer.value = new ResizeObserver((e) => {
        const [dom] = e || []
        if (dom) {
          const {height} = dom?.contentRect || {}
          if (!wrapperBox.value?.style) wrapperBox.value = {style: {}}
          wrapperBox.value.style.height = `${height}px`
        }
      })
      observer.value?.observe(innerBox.value)
    }
  },
  closeModal: () => {
    visible.value = false
    const {onClose} = propsRef.value || {}
    onClose && onClose()
  },
  reload: () => {
    visible.value = false
    const {reload} = propsRef.value || {}
    reload && reload()
  },
  updateList: () => {
    visible.value = false
    const {updateList} = propsRef.value || {}
    updateList && updateList()
  },
  
  ok: async () => {
    emits('ok', methods)
  },
  setDisabled: (value = false) => {
    disabled.value = value
  },
  setLoading: (value = false) => {
    loading.value = value
  },
}

onMounted(() => {
  //Modal的父组件注册他的proxy和modal的方法,用于包裹modal组件
  //此时,父组件的uid和proxy的uid是一样的, 通过相同的uid,可以直接用来传递值
  if (proxy.$parent) {
    proxy.$parent?.$emit('register', {...methods, proxy: proxy.$parent})
  }
  emits('register', methods)
  proxy.$forceUpdate()
})

const handleModalClosed = () => {
  if (proxy.$parent) proxy.$parent?.$emit('closed')
  emits('closed')
}
</script>

<template>
  <ElDialog
     v-bind="propsData"
     :visible.sync="visible"
     class="dialog"
     append-to-body
     @close="emits('close')"
     @closed="handleModalClosed"
     ref="dialog">
    <div class="wrapper-box" ref="wrapperBox">
      <div ref="innerBox" class="inner-box overflow-x-hidden" v-loading="confirmLoading || loading">
        <slot></slot>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="getFooterProps?.footer">
      <template v-if="!disabled">
        <el-button @click="methods.closeModal">取 消</el-button>
        <el-button type="primary" @click="methods.ok" :loading="confirmLoading || loading">确 定</el-button>
      </template>
      <el-button @click="visible = false" v-if="disabled">关 闭</el-button>
    </span>
  </ElDialog>
</template>

<style lang="scss" scoped>
.dialog {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-dialog) {
  margin: 0 !important;
  transition: all 0.3s;
}

:deep(.el-dialog__body) {
  padding: 20px 20px 20px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  overflow-x: hidden;
}

.wrapper-box {
  transition: all 0.2s;
  overflow-y: hidden;
}
</style>
