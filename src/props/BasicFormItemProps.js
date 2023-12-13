export const BasicFormItemProps = {
  formModel: Object,
  schema: Object,
  field: {type: String}, //用于向formList组件传递field
  setFieldsValue: {type: Function},
  $index: {type: [Number, String]},
  disabled: {
    default: false,
  },
  value: {},
  componentMap: {required: true}
}
