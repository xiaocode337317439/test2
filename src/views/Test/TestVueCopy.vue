<template>
  <div v-loading="loading">
    <EditerComponent
      :catch-data="catchData"
      :content="formContent"
      @blur.native.capture="checkDataUnique"
    />
    <ElButton @click="commit">提交</ElButton>
    <ElButton>{{ count }}</ElButton>
    <div>{{ msg }}</div>
    <div>{{ tmp }}</div>
    <br />
    <span class="red-point">设置</span>
    <br />
    <br />
    <span>关于</span>
    <RedPointComponent :redval="redCount">
      <template scope="redCount">
        <i v-show="redCount.text>0" class="redtip bg-danger">{{ redCount.text >= 99 ? '99+' : redCount.text }}</i>
      </template>
    </RedPointComponent>
  </div>
</template>
<script>
import EditerComponent from './EditerComponent'
import RedPointComponent from './RedPointComponent'

export default {
  components: {
    EditerComponent,
    RedPointComponent
  },
  data() {
    return {
      formContent: '<p>1234567890</p>',
      tmp: '',
      count: 0,
      msg: '',
      loading: true,
      redCount: '99'
    }
  },
  mounted() {
    this.tmp = this.formContent
    this.count = this.getSimpleText(this.tmp).length
    setTimeout(() => {
      this.loading = false
    }, 1000)
  },
  methods: {
    catchData(value) {
      console.log(value)
      this.tmp = value
      this.count = this.getSimpleText(this.tmp).length
    },
    // 将html标签去除， 统计内容
    getSimpleText(html) {
      // 匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
      const re1 = new RegExp('<.+?>', 'g')
      // 执行替换成空字符
      const msg = html.replace(re1, '')
      return msg
    },
    checkDataUnique() {
      if (this.getSimpleText(this.tmp).length <= 0) {
        this.msg = '要输入内容哦，不能为空'
      } else if (this.getSimpleText(this.tmp).length > 10) {
        this.msg = '内容输入的太多了，删除一点吧'
      } else {
        this.msg = '内容输入的满足要求， 可以提交'
      }
    },
    commit() {
      // 提交数据
      this.formContent = this.tmp
      console.log(this.formContent)
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  #wangeditor {
    width: 50rem;
  }

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
    border-radius: 50%;
    font-style: normal;
    color: #fff;
    display: inline-block;
    width: 1.2em;
    height: 1.2em;
    text-align: center;
    line-height: 1.2em;
    font-size: 0.8em;
  }

  .redtip-max {
    border-radius: 50%;
    font-style: normal;
    color: #fff;
    display: inline-block;
    width: 1.2em;
    height: 1.2em;
    text-align: center;
    line-height: 1.2em;
    font-size: 0.8em;
  }
</style>
