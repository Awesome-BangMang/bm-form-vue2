export const BasicFormProps = {
  schemas: {
    type: Array,
    default: () => [],
  },
  labelWidth: {
    type: [String, Number],
    default: '80px',
  },
  disable: {
    type: Boolean,
    default: false,
  },
  value: {
    type: Object,
    default: () => ({}),
  },
}
