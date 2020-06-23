<template>
  <el-tree
    :data="option"
    ref="tree"
    show-checkbox
    node-key="id"
    @check="handleCheck"
    :props="defaultProps">
  </el-tree>
</template>

<script>
  export default {
    data() {
      return {
        option: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 11,
            label: '二级 1-1',
            children: [{
              id: 111,
              label: '搜索'
            }, {
              id: 112,
              label: '三级 1-1-1'
            }, {
              id: 113,
              label: '三级 1-1-2'
            }]
          }, {
            id: 12,
            label: '二级 1-2',
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 21,
            label: '搜索'
          }, {
            id: 22,
            label: '二级 2-1'
          }, {
            id: 23,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 31,
            label: '搜索'
          }, {
            id: 32,
            label: '二级 3-1'
          }, {
            id: 33,
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
      handleCheck(currNode, selectObj) {
        // 声明函数
        const func = (arr, currNode, checked) => {
          let find = false
          arr.forEach(v => {
            if (v.label === '搜索' && !!checkNodes.find(id => id === v.id)) {
              //找到节点，代表选中，不用修改兄弟节点
              find = true
            }
          })
          //当前数据层级，没找到 (选中 搜索) 节点
          if (!find) {
            //查看当前层是否根本就没有 (搜索) 节点
            const isSearchNode = !!arr.find(v => v.label === '搜索')
            //当前层节点 包含 (搜索) 节点
            if (isSearchNode) {
              //默认除去当前层所有被选中的节点
              arr.forEach(v => {
                // 将以及选中的当前层几点，过滤掉
                checkNodes = checkNodes.filter(id => id !== v.id)
              })
              //没找到，代表当前层级'搜索'没有选中，需要将兄弟节点全部设置为未选中
              this.$refs.tree.setCheckedKeys(checkNodes);
            }
          }
          //查看是否有子节点，递归
          arr.forEach(v => {
            if (v.children && v.children.length > 0) {
              func(v.children, currNode, checked);
            }
          })
        }

        //获取所有选中接节点
        let checkNodes = selectObj.checkedKeys;
        //当前节点是否被选中
        const checked = !!selectObj.checkedKeys.find(id => id === currNode.id)
        func(this.option, currNode, checked);
      },
    }
  }
</script>
