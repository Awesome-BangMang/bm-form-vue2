import {ElCheckboxButton, ElInputNumber, ElCascader, ElSwitch} from '/element'
import {BasicSelect} from '@/BasicSelect'
import {BasicCheckbox} from '@/BasicCheckbox'
import {BasicRadio} from '@/BasicRadio'
import {BasicDate} from '@/BasicDate'
import {ApiCascader, ApiSelect} from '@/ApiComponent'
import {InputRange, BasicInput} from '@/BasicInput'

import FormList from './src/FormList.vue'
// import ModalSelect from './src/ModalSelect.vue'

const componentMap = new Map()

componentMap.set('Input', BasicInput)
componentMap.set('CheckboxButton', ElCheckboxButton)
componentMap.set('Date', BasicDate)
componentMap.set('InputNumber', ElInputNumber)
componentMap.set('Switch', ElSwitch)
componentMap.set('ApiSelect', ApiSelect)

componentMap.set('Select', BasicSelect)
componentMap.set('Checkbox', BasicCheckbox)
componentMap.set('Radio', BasicRadio)

componentMap.set('Cascader', ElCascader)
componentMap.set('ApiCascader', ApiCascader)

componentMap.set('text', BasicInput)

componentMap.set('List', FormList)
componentMap.set('InputRange', InputRange)

export function add(compName, component) {
  componentMap.set(compName, component);
}

export function del(compName) {
  componentMap.delete(compName);
}

export {componentMap}
