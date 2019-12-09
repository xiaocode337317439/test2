<template>
  <div>
    <el-card>
      <o-form
        ref="form"
        class="base-form"
        :form-value.sync="formData"
        :form-list="formList"
        not-ctrl
      >
        <div class="btn-group center" style="text-align: center;">
          <el-button class="cancle" @click="cancle">取消</el-button>
          <el-button class="submit" type="primary" @click="submit">提交</el-button>
        </div>
      </o-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      idcNameList: [],
      formData: {}
    }
  },
  computed: {
    formList() {
      return {
        children: [
          {
            title: '所属机房',
            type: 'select',
            key: 'code',
            rule: {
              required: true,
              message: '请选择所属机房',
              trigger: 'change'
            },
            props: {
              placeholder: '请选择机房'
            },
            options: this.idcNameList || []
          },
          {
            title: '集群名称',
            type: 'input',
            key: 'clusterName',
            showTips: true,
            tipsText: '集群名称',
            rule: {
              required: true,
              message: '请输入集群名称',
              trigger: 'blur'
            },
            props: {
              placeholder: '请输入集群名称'
            }
          },
          {
            title: '集群编码',
            type: 'input',
            key: 'clusterCode',
            rule: {
              required: true,
              message: '请输入集群编码',
              trigger: 'blur'
            },
            props: {
              placeholder: '请输入集限制使用小写字母，中划线"-"和数字群名称'
            }
          },
          {
            title: 'config',
            type: 'input',
            key: 'config',
            props: {
              placeholder: 'k8s apiServer config',
              type: 'textarea',
              'show-word-limit': true,
              maxlength: 200
            }
          }
        ]
      }
    }
  },
  created() {
    this.getHostList()
  },
  methods: {
    async getHostList() {
      this.idcNameList = await this.$ajax.get(
        '/base/hostList',
        {},
        { _mock: true }
      )
    },
    async submit() {
      await this.$refs.form.validate()
      await this.$ajax.post('/base/mockSuccess', {}, { _mock: true })

      // 这里可以获取到表单的数据
      this.$message({
        type: 'success',
        message: `提交成功`
      })
    },
    cancle() {}
  }
}
</script>
