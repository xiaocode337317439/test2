<script>
export default {
  name: 'OPageTable',
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    method: {
      type: String,
      default() {
        return 'get'
      }
    },
    // 是否复杂表格
    treeTable: {
      type: Boolean,
      default: false
    },
    // 透传给el-pagination的props
    paginationProps: {
      type: Object,
      default() {
        return {}
      }
    },
    // 透传给el-pagination的props
    tableProps: {
      type: Object,
      default() {
        return {}
      }
    },
    url: {
      type: String,
      default: ''
    },
    // 分页表格默认请求参数
    formData: {
      type: Object,
      default() {
        return {}
      }
    },
    loop: {
      type: Boolean,
      default: false
    },
    loopTime: {
      type: Number,
      default: 5000
    },
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 15
    },
    // 表格默认数据
    data: {
      type: Array,
      default() {
        return []
      }
    },
    // 决定使用哪个字段作为data
    dataKey: {
      type: String,
      default: 'list'
    },
    // 决定使用哪个字段作为total
    totalKey: {
      type: String,
      default: 'total'
    },
    // 决定使用哪个字段作为page
    pageKey: {
      type: String,
      default: 'currentPage'
    },
    // 发送前的钩子，用于调整请求参数
    // eslint-disable-next-line vue/require-default-prop
    beforeSendHook: {
      type: Function
    },
    // 表格默认选中
    defualtSelectTableData: {
      type: Array,
      default() {
        return []
      }
    },
    // 用于table数据设置默认选中那些数据，根据该key对应的value去判断
    checkDatakey: {
      type: String,
      default: 'key'
    },
    // 是否要分页
    hasPage: {
      type: Boolean,
      default() {
        return true
      }
    },
    formDataMark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      currentFormData: this.formData,
      tableData: [],
      internalTotal: 0,
      internalCurrentPage: 0,
      treeTableData: [],
      tableCellNumData: [] // 保存每行的每一列的合并行数
    }
  },
  watch: {
    formData(newValue, oldValue) {
      this.search(newValue)
    },
    data: {
      handler: function(val, oldVal) {
        if (this.treeTable) {
          this.treeTableData = this.treeTableFormat(
            JSON.parse(JSON.stringify(val || []))
          )
        } else {
          this.tableData = val
        }
      },
      deep: true,
      immediate: true
    },
    currentPage: {
      immediate: true,
      handler(newValue, oldValue) {
        this.internalCurrentPage = newValue
      }
    },
    total: {
      immediate: true,
      handler(newValue, oldValue) {
        this.internalTotal = newValue
      }
    },
    internalCurrentPage: {
      immediate: true,
      handler(newVal, oldValue) {
        this.$emit('update:currentPage', newVal)
        this.getTableData({
          ...this.currentFormData,
          [this.pageKey]: newVal
        })
      }
    },
    internalTotal: {
      immediate: true,
      handler(newVal, oldValue) {
        this.$emit('update:total', newVal)
      }
    },
    tableData(newValue, oldValue) {
      if (!this.defualtSelectTableData.length) return
      if (!newValue.length) return
      if (!this.checkDatakey) return
      this.rowCheckByKey()
    }
  },
  mounted() {
    if (this.formDataMark) {
      this.setQuery(this.formData)
    }
  },
  beforeDestroy() {
    if (this.t) {
      window.clearTimeout(this.t)
    }
  },
  methods: {
    setQuery(val) {
      this.$router.push({
        query: {
          ...this.$route.query,
          ...val
        }
      })
    },
    async rowCheckByKey() {
      await this.$nextTick()
      const checkDatakeyArr = this.defualtSelectTableData.map(
        v => v[this.checkDatakey]
      )
      const { checkDatakey } = this
      this.tableData.forEach(v => {
        if (checkDatakeyArr.includes(v[checkDatakey])) {
          this.$refs.table.toggleRowSelection(v)
        }
      })
    },
    search(formData = this.formData) {
      this.getTableData({
        ...formData,
        [this.pageKey]: 1
      })
      this.currentFormData = formData
      this.internalCurrentPage = 1

      if (this.formDataMark) {
        this.setQuery(formData)
      }
    },
    getTableData(data, showTableLoading = true) {
      if (!this.url) {
        return
      }
      if (this.t) {
        clearTimeout(this.t)
      }
      if (
        this.loopPadding &&
        this.loop &&
        !this._isDestroyed &&
        !showTableLoading
      ) {
        this.t = setTimeout(() => this.getTableData(data, false), this.loopTime)
        return
      }

      this[showTableLoading ? 'loading' : 'loopPadding'] = true
      const query = {
        ...data,
        pageSize: this.pageSize
      }
      if (this.beforeSendHook) {
        this.beforeSendHook(query)
      }
      this.$ajax[this.method](this.url, query)
        .then(data => {
          if (!data) {
            return
          }
          const result =
            data &&
            (data[this.dataKey] || data.result || data.list || data || [])
          this.$emit('update:data', result)
          this.internalTotal =
            data[this.totalKey] || data.totalCount || data.total
          if (this.treeTable) {
            this.treeTableData = this.treeTableFormat(result || [])
          } else {
            this.tableData = result || []
          }
        })
        .finally(() => {
          this[showTableLoading ? 'loading' : 'loopPadding'] = false
          if (this.loop && !this._isDestroyed) {
            this.t = setTimeout(
              () => this.getTableData(data, false),
              this.loopTime
            )
          }
        })
    },
    getCloumnKey() {
      const columnsMap = {}
      this.columns.forEach(item => {
        if (item.type !== 'index' && item.key) {
          columnsMap[item.key] = []
        }
      })
      columnsMap.isShow = true
      return columnsMap
    },
    treeTableFormat(result) {
      let data = []
      if (result.length) {
        data = result.map(item => {
          const { columnsKey, columnsChildrenNum } = this.columnsFormat(
            item,
            this.getCloumnKey()
          )
          this.tableCellNumData.push(columnsChildrenNum)
          return columnsKey
        })
      }
      return data
    },
    columnsFormat(data, columnsKey) {
      let temp = [data]
      // 获取一个空的列信息，用来存储没列信息的child数量，用作单元格合并
      const columnsChildrenNum = this.getCloumnKey()
      while (temp.length > 0) {
        const currentNode = temp.pop()
        const currentNodeKeyList = Object.keys(currentNode)

        currentNodeKeyList.forEach(key => {
          if (key === 'children' || key === 'keyList' || key === 'isShow') {
            return
          }
          // *：代表当前key没有在列信息内， #：表示当前节点是叶子节点
          if (columnsKey[key]) {
            columnsKey[key].push(currentNode[key])
            // columnsChildrenNum
            columnsChildrenNum[key].push(
              currentNode.children ? currentNode.children.length : '#'
            )
          } else {
            columnsKey[key] = [currentNode[key]]
            columnsChildrenNum[key] = ['*']
          }
        })
        if (currentNode.children) {
          if (!currentNode.children.length) {
            // 将子节点没有的字段补上
            const childrenKey = {}
            const parentKeyStr =
              Object.keys(currentNode)
                .concat(currentNode.keyList)
                .join(',') + ','
            Object.keys(columnsChildrenNum).forEach(key => {
              if (parentKeyStr.indexOf(key + ',') === -1) {
                childrenKey[key] = ''
              }
            })
            currentNode.children.push(childrenKey)
          } else {
            // 给父节点的合并节点数增加，支持无线增加
            if (currentNode.keyList) {
              currentNode.keyList.forEach(key => {
                if (
                  key === 'children' ||
                  key === 'keyList' ||
                  key === 'isShow'
                ) {
                  return
                }
                const item = columnsChildrenNum[key]
                item[item.length - 1] += currentNode.children.length - 1
              })
            }
            // 将父节点的key传递给子节点
            currentNode.children.map(child => {
              child.keyList = currentNode.keyList
                ? currentNode.keyList.concat(currentNodeKeyList)
                : currentNodeKeyList
            })
          }

          temp = temp.concat(currentNode.children)
        } else {
          // 将子节点没有的字段补上
          Object.keys(columnsChildrenNum).forEach(key => {
            Object.keys(currentNode)
              .concat(currentNode.keyList || [])
              .forEach(subKey => {
                if (key !== subKey) {
                  currentNode[key] = ''
                }
              })
          })
        }
      }

      return {
        columnsKey,
        columnsChildrenNum
      }
    },
    renderTable(h) {
      const slots = Object.keys(this.$slots).reduce(
        (arr, key) => arr.concat(this.$slots[key]),
        []
      )
      return h(
        'el-table',
        {
          props: {
            data: this.treeTable ? this.treeTableData : this.tableData,
            ...this.tableProps
          },
          directives: [
            {
              name: 'loading',
              value: this.loading
            }
          ],
          ref: 'table',
          class: ['table', this.treeTable ? 'split-table' : 'common-table'],
          on: this.$listeners
        },
        this.columns.length ? this.renderTableColumn(h) : slots
      )
    },
    renderTableColumn(h) {
      return this.columns.map((v, i) => {
        const option = {
          props: {
            prop: v.key,
            label: v.title,
            ...v
          }
        }
        if (v.render || this.treeTable) {
          option.scopedSlots = {
            default: props =>
              this.treeTable
                ? this.renderTreeTableColumn(h, props, v)
                : v.render(h, props)
          }
        }
        return h('el-table-column', option)
      })
    },
    renderTreeTableColumn(h, params, item) {
      const tdCellList = this.treeTableData[params.$index][item.key]
      const tdCellsNum = this.tableCellNumData[params.$index][item.key]
      if (!item.key && item.render) {
        return item.render(h, params)
      }
      return (
        <ul class={[item.control ? 'td-cell main-td' : 'td-cell child-td']}>
          {tdCellList.map((tdItem, trIndex) => {
            return (
              <li style={{ flex: tdCellsNum[trIndex] || 1 }}>
                {item.render ? item.render(h, params, trIndex) : tdItem}
              </li>
            )
          })}
        </ul>
      )
    },
    renderPagination(h) {
      const _this = this
      if (!this.hasPage) return
      return h('el-pagination', {
        props: {
          pageSize: this.pageSize,
          total: this.internalTotal || 0,
          currentPage: this.internalCurrentPage,
          ...this.paginationProps
        },
        class: {
          pagination: true
        },
        on: {
          'update:currentPage'(val) {
            _this.internalCurrentPage = val || 1
          },
          ...this.$listeners
        }
      })
    }
  },
  render(h) {
    return (
      <div class="table-page">
        {[
          this.renderTable(h),
          <div class="pagination-box">{this.renderPagination(h)}</div>
        ]}
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
.table-page {
  .table {
    margin-bottom: 20px;
  }
  .pagination-box {
    display: flex;
    justify-content: flex-end;
  }
  /deep/ {
    table {
      .el-button-group,
      .operate-btn-group {
        .el-button {
          padding: 0;
          color: #2fc29b;
          border: 0;
          background: none;
          display: inline-block;
          margin: 0 6px 0 6px;
        }
        .el-button:after,
        .with-separate:after {
          content: '|';
          width: 1px;
          display: inline-block;
          margin-left: 6px;
          color: #ccc;
        }
        .el-button:last-child:after {
          display: none;
        }
      }
    }

    tbody td {
      height: 60px;
    }
    tbody .cell {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
    }
  }

  .td-cell {
    width: 100%;
    padding: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .td-cell {
    text-align: center;

    > li {
      border-bottom: 1px solid #eff0f0;
      min-height: 48px;

      &:last-child {
        border-bottom: 0;
      }
    }
  }
  // 多行合并表格
  .split-table {
    .td-cell {
      display: flex;
      flex-direction: column;
      height: 100%;

      > li {
        display: flex;
        align-items: center;
        vertical-align: middle;
        text-align: center;
        justify-content: center;
        width: 100%;
      }
    }
  }
}
</style>
