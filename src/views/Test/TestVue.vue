<template>
  <el-tree
    ref="tree"
    :data="data"
    show-checkbox
    default-expand-all
    node-key="id"
    highlight-current
    :props="defaultProps"
  >
  </el-tree>
</template>

<script>
export default {

  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    // 模拟后台获取数据
    const netData = [{
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
    }]
    // 模拟后台获取选中id集合
    const idList = [9, 5, 8]
    // 定义过滤函数
    const filterData = (allData, selectIds) => {
      return allData.filter(value => {
        if (value.children) {
          // 递归
          value.children = filterData(value.children, selectIds)
          return (value.children && value.children.length > 0)
        } else {
          return selectIds.find(selectId => value.id === selectId)
        }
      })
    }
    this.$nextTick(() => {
      // 过滤数据，赋值渲染
      this.data = filterData(netData, idList)
      // 设置选中
      this.$refs.tree.setCheckedKeys(idList)
    })
  }
}
</script>
