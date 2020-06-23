<template>
  <div>
    <span>关于</span>
    <RedPointComponent :redval="redCount">
      <template scope='redCount'>
        <i v-if="redCount.text > 0 && !showRedPoint" class="bg-danger redtip">
          {{redCount.text >= 99 ? '99+' : redCount.text}}
        </i>
        <i v-else class="red-point"></i>
      </template>
    </RedPointComponent>
  </div>
</template>
<script>
  import RedPointComponent from './RedPointComponent'

  export default {
    data() {
      return {
        redCount: "10",
        //是否只显示红点
        showRedPoint: false
      }
    },
    components: {
      RedPointComponent
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .red-point {
    position: relative;
  }

  .red-point::before {
    content: " ";
    border: 3px solid red; /*设置红色*/
    border-radius: 3px; /*设置圆角*/
    position: absolute;
    z-index: 1000;
    right: 0;
    margin-right: -8px;
  }

  .redtip {
    display: inline-block;
    text-align: center;
    background: #f74c31;
    color: #fff;
    font-size: 12px;
    height: 16px;
    line-height: 16px;
    border-radius: 8px;
    padding: 0 6px;
    background-clip: padding-box;
    vertical-align: middle;
  }
</style>
