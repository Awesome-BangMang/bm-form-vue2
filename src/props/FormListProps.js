export const FormListProps = {
  schemas: {
    type: Array,
    default: () => [],
  },
  labelWidth: {
    type: [String, Number],
    default: '80px',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  value: {
    type: Array,
    default: () => [],
  },
  formItemField: {
    type: String,
  },
  clearButton: {
    type: Boolean,
    default: true,
  },
  componentMap: {required: true}
}
