<template>
  <el-dialog
    title="编辑分组"
    :visible.sync="dialogModalShow"
    @close="closeDialog"
    width="600px"
  >
    这里是内容
    <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
  </el-dialog>
</template>
<script>
  export default {
    name: 'DialogComponent',
    data() {
      return {
        dialogModalShow: false,
      }
    },
    props: {
      //这个要特殊处理，不然父组件改变会影响这个值，会报警告
      modalShow: false,
      close: {}
    },
    watch: {
      modalShow (newValue, oldValue) {
        this.dialogModalShow = newValue
      },
    },
    methods: {
      closeDialog () {
        //回调
        this.close()
      },
      confirm () {
        //这里发请求
        // 成功后关闭
        this.closeDialog()
      }
    }
  }
</script>
