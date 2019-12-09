import OForm from './OForm'
import OPageTable from './OPageTable'

const components = {
  OForm,
  OPageTable
}

export function componentMixin(Vue) {
  // 全局注册组件
  Object.values(components).forEach(component => {
    Vue.component(component.name, component)
  })
}
