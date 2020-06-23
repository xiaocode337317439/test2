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
        const func = (arr, currNode) => {
          debugger
          //当前层节点是否选中 (搜索) 节点
          const searchNodeChecked = arr.find(v => v.label === '搜索' && !!checkNodes.find(id => id === v.id))
          if (!searchNodeChecked) {
            // currNode 节点不是选中的 搜索 节点， 但是搜索节点没有被选中， 这时候自动选中搜索节点
            const searchNode = arr.find(v => v.label === '搜索');
            if (searchNode) {
              checkNodes.push(searchNode.id);
            }

            // //默认除去当前层所有被选中的节点
            // arr.forEach(v => {
            //   // 将以及选中的当前层几点，过滤掉
            //   checkNodes = checkNodes.filter(id => id !== v.id)
            // })
            //没找到，代表当前层级'搜索'没有选中，需要将兄弟节点全部设置为未选中
            this.$refs.tree.setCheckedKeys(checkNodes);
          } else {

          }
          //查看是否有子节点，递归
          arr.forEach(v => {
            if (v.children && v.children.length > 0) {
              func(v.children, currNode);
            }
          })
        }

        //获取所有选中接节点
        let checkNodes = selectObj.checkedKeys;
        func(this.option, currNode);
      },
    }
  }
</script>
