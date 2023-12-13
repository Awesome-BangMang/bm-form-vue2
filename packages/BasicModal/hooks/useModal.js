import { getCurrentInstance, nextTick, onMounted, onUnmounted, provide, reactive, ref, unref, watch } from 'vue'
import Vue from 'vue'

const eventBus = new Vue()
const dataTransfer = reactive({})
const OPEN_EVENT_KEY = 'openModal'
const LOADING_EVENT_KEY = 'modalLoading'

/**
 *
 * @description 用于注册modal组件,并且提供打开和关闭modal的方法
 * @paramRef {Function} [modalProps.onClose] - 关闭modal后的回调
 */
export const useModal = (modalProps = {}) => {
  const instance = ref()

  const register = (methods) => (instance.value = unref(methods))

  const methods = {
    openModal: (props, data = undefined) => {
      const { _uid } = unref(instance)?.proxy
      const { disabled = false} = props || {}
      dataTransfer[_uid] = data
      //传递数据
      eventBus.$emit(OPEN_EVENT_KEY + _uid, dataTransfer)
      //设置modal内部的Form组件能否编辑
      unref(instance)?.setDisabled(disabled)

      return unref(instance)?.openModal({
        ...modalProps,
        onClose: modalProps?.onClose ? () => modalProps?.onClose(data) : undefined,
        ...props,
      })
    },
    closeModal: () => unref(instance)?.closeModal(),
  }

  onMounted(() => {
    eventBus.$on(LOADING_EVENT_KEY + unref(instance)?.proxy?._uid, (e) => {
      unref(instance)?.setLoading(e)
    })
  })

  onUnmounted(() => {
    eventBus.$off(LOADING_EVENT_KEY + unref(instance)?.proxy?._uid)
  })

  return [register, methods]
}

/**
 * @description 用于获取modal内部的数据
 * @param callBack {Function} - 回调函数
 * @return {[Ref<any>]}
 */
export const useModalInner = (callBack) => {
  const innerData = ref()
  const uid = ref()

  onMounted(() => {
    const { proxy } = getCurrentInstance()

    if (proxy && proxy._uid) {
      uid.value = proxy._uid
      eventBus.$on(OPEN_EVENT_KEY + uid.value, async () => {
        const { _uid } = proxy
        innerData.value = dataTransfer[_uid]
        if (!callBack) return

        await nextTick()
        try {
          eventBus.$emit(LOADING_EVENT_KEY + _uid, true)
          await callBack(innerData.value || {})
        } finally {
          proxy?.$forceUpdate()
          eventBus.$emit(LOADING_EVENT_KEY + _uid, false)
        }
      })
    }
  })

  onUnmounted(() => {
    eventBus.$off(OPEN_EVENT_KEY + uid.value)
  })
  return [innerData]
}
