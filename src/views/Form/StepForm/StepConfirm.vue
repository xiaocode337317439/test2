<template>
  <div>
    <o-form
      ref="form"
      class="base-form"
      :form-list="formList"
      not-ctrl
      :form-value="formValue"
      @update:formValue="$listeners['update:formValue']"
    >
      <div class="submit-group">
        <el-button @click="$emit('update:currentStep', currentStep - 1)">上一步</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </o-form>
  </div>
</template>
<script>
export default {
  name: 'StepConfirm',
  props: {
    formValue: {
      type: Object,
      required: true
    },
    currentStep: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      idcNameList: []
    }
  },
  computed: {
    formList() {
      return {
        children: [
          {
            render(h) {
              return <h3 class="sub-title">基本信息</h3>
            }
          },
          {
            title: '机房名称',
            type: 'text',
            key: 'appId'
          },
          {
            title: '集群编码',
            type: 'text',
            key: 'clusterCode'
          },
          {
            render(h) {
              return <h3 class="sub-title">高级设置</h3>
            }
          },
          {
            title: '镜像版本',
            type: 'text',
            key: 'image'
          },
          {
            title: '集群名称',
            type: 'text',
            key: 'clusterName'
          }
        ]
      }
    }
  },
  methods: {
    async submit() {
      await this.$refs.form.validate()
      await this.$ajax.post(
        '/base/mockSuccess',
        { data: this.formValue },
        { _mock: true, _confirm: '确认提交？' }
      )
      this.$message.success('提交成功')
    }
  }
}
</script>
<style lang="scss" scoped>
.submit-group {
  display: flex;
  justify-content: flex-end;
}
</style>
