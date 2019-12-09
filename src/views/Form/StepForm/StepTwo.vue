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
  name: 'StepTwo',
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
      imageInfoList: []
    }
  },
  computed: {
    formList() {
      return {
        children: [
          {
            title: '镜像版本',
            type: 'select',
            key: 'image',
            props: {
              'label-in-value': true,
              filterable: true
            },
            options: this.imageInfoList,
            on: {
              change: value => {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.formValue.appName = this.findSelectLabel(
                  this.imageInfoList,
                  value
                )
              }
            }
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
      this.imageInfoList = await this.$ajax.get(
        '/base/imageList',
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
