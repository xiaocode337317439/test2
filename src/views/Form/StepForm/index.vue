<template>
  <el-card>
    <el-steps :active="currentStep" align-center finish-status="success">
      <el-step
        v-for="v of stepConfig"
        :key="v.title"
        :icon="v.icon"
        :title="v.title"
      ></el-step>
    </el-steps>
    <div class="step-content-box">
      <component
        :is="$options.components[currentStepComponetKey]"
        :form-value.sync="formValue"
        :current-step.sync="currentStep"
      ></component>
    </div>
  </el-card>
</template>
<script>
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepConfirm from './StepConfirm'
export default {
  name: 'StepForm',
  components: {
    StepOne,
    StepTwo,
    StepConfirm
  },
  data() {
    return {
      stepConfig: [
        {
          icon: 'el-icon-edit-outline',
          component: 'StepOne',
          title: '基本信息'
        },
        {
          icon: 'el-icon-setting',
          component: 'StepTwo',
          title: '高级设置'
        },
        {
          icon: 'el-icon-upload',
          component: 'StepConfirm',
          title: '信息确认'
        }
      ],
      currentStep: 0,
      formValue: {}
    }
  },
  computed: {
    currentStepComponetKey() {
      return this.stepConfig[this.currentStep].component
    }
  }
}
</script>
