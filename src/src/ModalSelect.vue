<script setup="">
import { computed, nextTick, reactive, ref } from 'vue'
import { BasicCrud, useCrud } from '@/components/BasicCrud/index.js'
import { cloneDeep, isArray } from 'lodash-es'

const props = defineProps({
  value: {},
  multiple: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '选择',
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  api: {
    type: Function,
  },
  //value数据的格式
  props: {
    type: Object,
    default: () => ({
      label: 'label',
      value: 'value',
    }),
  },
  option: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
  },
  showPage: {
    type: Boolean,
    default: true,
  },
  proxyProps: {
    type: Object,
  },
})

//输出 {label:xx,value:xx的格式}
const emits = defineEmits(['input', 'update'])

const show = ref(false)

const [register, { getList, reload }] = useCrud()

const crudProps = reactive({
  option: {
    selection: false,
    height: '500px',
    menuWidth: 60,
    ...props?.option,
  },
  showPage: props.showPage,
  proxy: {
    autoLoad: false,
    props: props?.proxyProps,
    ajax: {
      query: async ({ page, form }) => {
        const { current, size } = page
        return props?.api && props?.api({ current, size, ...form, ...props?.params })
      },
    },
  },
})

const open = async () => {
  if (props?.disabled) return
  show.value = true
  await nextTick()
  await reload()
}

const selectItem = (e) => {
  const labelField = props?.props?.label
  const valueField = props?.props?.value

  const selectedValue = { label: e[labelField] || '', value: e[valueField] || '' }
  if (props?.multiple) {
    const arr = cloneDeep(props.value) || []

    if (arr?.map((i) => i?.value)?.includes(e[valueField])) return
    arr.push(selectedValue)
    emits('input', arr)
  } else {
    emits('input', selectedValue)
    emits('update', e)
    show.value = false
  }
}

//处理关闭
const handleClose = (e) => {
  const field = props?.props?.value
  const value = e[field]

  if (!props.multiple) return
  const arr = cloneDeep(props.value) || []
  const index = arr?.findIndex((i) => i[field] === value)
  if (index === -1) return
  arr.splice(index, 1)
  emits('input', arr)
}

//处理清空
const handleClear = () => {
  const { multiple } = props
  const value = multiple ? [] : null
  emits('input', value)
  emits('update', null)
}

//获取值
const getSelectValue = computed(() => {
  let { multiple, value } = props || {}

  if (multiple) {
    if (!isArray(value) || !value) value = []
    return value?.map((i) => i?.value) || []
  } else return (value && value?.value) || ''
})

//返回格式 { label:'',value:''}[]
const getSelectOptions = computed(() => {
  const { multiple, value } = props || {}

  if (multiple) return value || []
  else return value ? [value] : []
})
</script>

<template>
  <div class="w-full">
    <el-select
      :disabled="disabled"
      :value="getSelectValue"
      :multiple="props?.multiple"
      placeholder=""
      class="w-full"
      :popper-append-to-body="false"
      :filterable="false"
      @click.native="open"
      clearable
      @clear="handleClear"
      @remove-tag="handleClose">
      <el-option
        :key="index"
        v-for="(tag, index) in getSelectOptions"
        :label="tag?.label"
        :value="tag?.value"></el-option>
    </el-select>

    <el-dialog :title="title" :visible.sync="show" append-to-body width="1200px" top="60px" class="dialog">
      <div class="overflow-y-auto overflow-x-hidden max-h-[calc(100vh_-_180px)]">
        <div class="my-20px min-h-40px" v-if="props?.multiple">
          <h3 class="text-16px font-500 mb-12px">已选择:</h3>
          <el-tag
            class="mb-12px mr-12px"
            :key="tag?.value"
            v-for="tag in getSelectOptions"
            closable
            disable-transitions
            @close="handleClose(tag)">
            {{ tag?.label }} ({{ tag?.value }})
          </el-tag>
        </div>
        <BasicCrud @register="register" v-bind="crudProps">
          <template #menu="{ row }">
            <el-button type="text" @click="selectItem(row)">选择</el-button>
          </template>
        </BasicCrud>
      </div>
      <div slot="footer" class="dialog-footer" v-if="props?.multiple">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="show = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-select) {
  .el-select-dropdown {
    display: none;
  }
}

:deep(.avue-crud) {
  .avue-crud__menu {
    display: none;
  }
}

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
}

.wrapper-box {
  transition: all 0.2s;
  overflow-y: hidden;
}
</style>
