import Vue from 'vue'
import ElementUI from 'element-ui'
import { sync } from 'vuex-router-sync'
import { ajaxMixin } from '@/utils/ajax'
import { componentMixin } from './components'
import App from './App.vue'

import '@/utils/filters'
import '@/utils/directives'
import '@/utils/extend'

import router from './router'
import store from './store'
// 默认使用element的medium尺寸
Vue.use(ElementUI, {
  size: 'medium'
})

Vue.use(ajaxMixin, {
  mockServerId: '5d9300aa42b05f407a939f7e'
})
Vue.use(componentMixin)

// 公共模块， 和整个应用相关的配置写在这里，router实例和store实例是必传的
sync(store, router)

Vue.config.productionTip = false

// 下拉text查询函数
Vue.prototype.findSelectLabel = function(list = [], value = '') {
  const obj = list.find(item => {
    return item.value === value
  })
  return (obj && obj.text) || ''
}

/* eslint-disable no-new */
const app = new Vue({
  router,
  store,
  render(h) {
    return h(App)
  }
})

// 延迟vue实例的挂载，推迟到router实例化完成后
router.onReady(() => {
  app.$mount('#app')
})

export default app
