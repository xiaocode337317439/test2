<template>
  <el-cascader
    v-model="selectValue"
    :options="options"
    :props="props"
    collapse-tags
    clearable
  ></el-cascader>
</template>

<script>
export default {
  data() {
    return {
      props: { multiple: true },
      selectValue: [],
      options: [{
        value: 1,
        label: '东南',
        children: [{
          value: 2,
          label: '上海'
        }, {
          value: 7,
          label: '江苏'
        }, {
          value: 12,
          label: '浙江'
        }]
      }, {
        value: 17,
        label: '西北',
        children: [{
          value: 18,
          label: '陕西'
        }, {
          value: 21,
          label: '新疆维吾尔族自治区'
        }]
      }]
    }
  },
  mounted() {

  }
}
</script>
