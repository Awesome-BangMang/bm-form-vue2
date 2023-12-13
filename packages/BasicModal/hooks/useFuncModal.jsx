import BasicModal from '../src/BasicModal.vue'
import Vue, { nextTick, onUnmounted, ref, unref } from 'vue'

export const useFuncModal = (modalProps = {}) => {
  let instance

  const modal = ref()

  const ModalConstructor = Vue.extend()

  //初始化实例
  const initInstance = (component, data) => {
    instance = new ModalConstructor({
      render(h) {
        const componentVNode = component ? h(component, { props: data }) : null

        return h(BasicModal, [componentVNode])
      },
    })

    instance?.$on('register', (e) => {
      modal.value = e
    })

    instance?.$on('closed', async () => {
      await nextTick()
      handelModalDestroy()
    })

    instance.$mount()
    document.body.appendChild(instance.$el)
  }

  //处理卸载实例
  function handelModalDestroy() {
    if (instance) {
      // 销毁 Vue 实例
      instance.$destroy()
      // 从 DOM 中移除实例的根元素
      if (instance.$el && instance.$el.parentNode) {
        instance.$el.parentNode.removeChild(instance.$el)
      }

      // 清理引用，帮助垃圾回收
      instance = null
    }
  }

  const openModal = async (props, data = undefined) => {
    const { component = null, ...reset } = props
    if (!instance) initInstance(component, data)
    unref(modal)?.openModal({ ...modalProps, ...reset })
  }

  /**
   * @description 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
   * @return {Promise<void>}
   */
  const onOk = async () => {

  }

  onUnmounted(() => {
    handelModalDestroy()
  })

  return { openModal }
}
