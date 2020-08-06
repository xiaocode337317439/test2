<template>
  <div class="container">
    <el-card>
      <o-form ref="form" :form-list="formList" not-ctrl></o-form>
      <div class="btn-group fl-lt">
        <el-button type="primary" plain @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </el-card>
    <el-card>
      <!-- 列表区域 -->
      <div class="table-btn-group">
        <el-button type="primary" @click="groudEdit('add')">
          <i class="el-icon-circle-plus m-r-5"></i>新增
        </el-button>
      </div>
      <o-page-table :form-data="formData" :columns="tabelColumns" :url="url"></o-page-table>
    </el-card>
    <!--<DialogComponent :edit-form-list="editFormList" :edit-type="editType" :form="form" :hide="hide" :modal-show="modalShow"-->
    <!--:save="save" :close="close"/>-->
    <DialogComponent :modal-show="modalShow" :close="close" />
  </div>
</template>

<script>
import DialogComponent from './DialogComponent'

export default {
  components: { DialogComponent },
  data() {
    return {
      url:
        'http://mock.fe-dev.wanyol.com:8020/mock/5d9300aa42b05f407a939f7e/base/dataList',
      formData: {},
      searchForm: {},
      form: {},
      tableData: [],
      editType: 'add',
      modalShow: false,
      tabelColumns: [
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 50
        },
        {
          title: '源租户',
          key: 'originTenantName'
        },
        {
          title: '源NameSpace',
          key: 'originNamespace'
        },
        {
          title: '目标机房',
          key: 'targetZone'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '操作',
          key: 'operate',
          render: (h, params) => {
            return (
              <el-button-group>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push('/list/detail')
                  }}
                >
                  详情
                </el-button>
                <el-button
                  onClick={() => this.groudEdit('edit', params.row)}
                  type="text"
                >
                  编辑
                </el-button>
              </el-button-group>
            )
          }
        }
      ],
      idcNameList: [],
      formList: [
        {
          title: '租户',
          type: 'input',
          key: 'tenantId'
        },
        {
          title: 'NameSpace',
          type: 'input',
          key: 'namespaceId'
        },
        {
          title: 'topic',
          type: 'input',
          key: 'topicId'
        }
      ]
    }
  },
  computed: {
    editFormList() {
      return {
        children: [
          {
            title: '源租户',
            type: 'input',
            rule: {
              required: true,
              message: '必填项',
              trigger: 'blur'
            },
            key: 'originTenantName'
          },
          {
            title: '源NameSpace',
            type: 'input',
            rule: {
              required: true,
              message: '必填项',
              trigger: 'blur'
            },
            key: 'originNamespace'
          },
          {
            title: '目标机房',
            type: 'select',
            rule: {
              required: true,
              message: '必填项',
              trigger: 'blur'
            },
            key: 'gray_env',
            options: this.idcNameList
          }
        ]
      }
    }
  },
  created() {
    this.getHostList()
  },
  methods: {
    groudEdit(type, item) {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.editType = type
      this.modalShow = true
      if (type === 'edit' && item) {
        this.form = { ...item }
      }
    },
    async getHostList() {
      this.idcNameList = await this.$ajax.get(
        '/base/hostList',
        {},
        { _mock: true }
      )
    },
    hide() {
      this.$refs.form.reset()
      this.modalShow = false
      this.currenSetRole = null
    },
    async save() {
      await this.$refs.form.validate()
      await this.$ajax.post(
        '/base/mockSuccess',
        { data: this.formValue },
        { _mock: true, _confirm: '确认提交？' }
      )
      this.$message.success('操作成功')

      this.search()
      this.hide()
    },
    reset() {
      this.searchForm.reset()
      this.search()
    },
    search() {
      this.formData = this.$refs.form.getForm()
    },
    close() {
      this.modalShow = false
    }
  }
}
</script>
