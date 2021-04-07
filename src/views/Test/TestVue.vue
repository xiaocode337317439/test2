<template>
  <el-tree
    ref="tree"
    :data="data"
    show-checkbox
    default-expand-all
    node-key="id"
    highlight-current
    :props="defaultProps"
    @check-change="handleCheckChange"
  >
  </el-tree>
</template>

<script>
export default {

  data() {
    return {
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    filter(data, checkedNodes) {
      return data.filter(value => {
        if (value.children) {
          value.children = this.filter(value.children, checkedNodes)
          return (value.children && value.children.length > 0)
        } else {
          return checkedNodes.find(findData => value.id === findData.id)
        }
      })
    },
    handleCheckChange(data, checked, indeterminate) {
      if (!indeterminate && !data.children) {
        // 被选中，子节点没有和节点数据没有children则判定为最终勾选的节点
        // 序列化this.data防止，改变原始数据， 因为this.data 传递到js方法是引用传递，会修改内存中的值
        let copy = JSON.parse(JSON.stringify(this.data))
        // 过滤所有选中没有孩子节点 即为最终勾选节点
        const checkedNodes = this.$refs.tree.getCheckedNodes().filter(value => !value.children)
        // 过滤数据
        copy = this.filter(copy, checkedNodes)
        console.log(copy)
      }
    }
  }
}
</script>
