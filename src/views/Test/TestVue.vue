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
        children: 'childList',
        label: 'title'
      }
    }
  },
  mounted() {
    // 模拟后台获取数据
    const netData = [{
      id: 1,
      title: '一级 1',
      childList: [{
        id: 4,
        title: '二级 1-1',
        childList: [{
          id: 9,
          title: '三级 1-1-1',
          childList: [
            {
              id: 11,
              title: '四级 1-1-1-1'
            },
            {
              id: 12,
              title: '四级 1-1-1-2'
            }
          ]
        }, {
          id: 10,
          title: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      title: '一级 2',
      childList: [{
        id: 5,
        title: '二级 2-1'
      }, {
        id: 6,
        title: '二级 2-2'
      }]
    }, {
      id: 3,
      title: '一级 3',
      childList: [{
        id: 7,
        title: '二级 3-1'
      }, {
        id: 8,
        title: '二级 3-2'
      }]
    }]
    // 模拟后台获取选中id集合
    const idList = [9, 5, 8, 12]
    // 定义过滤函数
    const filterData = (allData, selectIds) => {
      return allData.filter(value => {
        if (value.childList) {
          // 递归
          value.childList = filterData(value.childList, selectIds)
          return (value.childList && value.childList.length > 0)
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
