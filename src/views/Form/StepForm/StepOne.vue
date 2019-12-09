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
        <el-button type="primary" @click="submit">下一步</el-button>
      </div>
    </o-form>
  </div>
</template>
<script>
export default {
  name: 'StepOne',
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
            title: '选择机房',
            type: 'select',
            key: 'appId',
            rule: {
              required: true,
              message: '请选择应用名称',
              trigger: 'change'
            },
            options: this.idcNameList,
            on: {
              change: value => {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.formValue.appName = this.findSelectLabel(
                  this.idcNameList,
                  value
                )
              }
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

      this.$emit('update:currentStep', this.currentStep + 1)
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
