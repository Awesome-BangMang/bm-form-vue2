<script setup="">
// import {BmForm,useForm} from '/node_modules/bm-form-vue/bm-form-vue2.js'
import {BmForm,useForm} from 'bm-form-vue2'


const [register, {validate}] = useForm({
  labelWidth: "120",
  schemas: [
    {
      label: "标签",
      field: '1',
      component: 'Select',
      show({formModel}) {
        return !!formModel.xx
      },
      span: 12,
    },
    
    {
      label: "标签11",
      field: 'abs',
      span: 24,
      events: {
        focus(e) {
          console.log(e)
        },
      }
    },
    {
      label: "标签11",
      field: 'cbs',
      span: 24,
    },
    {
      label: "xx",
      field: 'xx',
      component: 'Switch',
      span: 24,
      events({setFieldsValue}) {
        return {
          change(e) {
            setFieldsValue({abs: Math.random()})
          }
        }
      }
    },
    {
      label: "标签sssadads",
      field: 'sssadads',
      span: 12,
    },
    {
      label: "标签11",
      field: 'ssasdasdafs',
      span: 12,
    },
    {
      label: "标fd签11",
      field: 'ssfdsfs',
      span: 12,
    },
  
  ]
})
</script>

<template>
 <div>
   <BmForm @register="register" class="border"/>
 </div>
</template>
