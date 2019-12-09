import Vue from 'vue'
import Router from 'vue-router'
import ErrorPage from '@/components/ErrorPage'

const RouterViewHoc = {
  name: 'RouterViewHoc',
  render(h) {
    return h('router-view')
  }
}

Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'index',
      component: () => import('@/views/Index' /* webpackChunkName: "index" */),
      meta: {
        title: '主页'
      }
    },
    {
      path: '/form',
      name: 'form',
      component: RouterViewHoc,
      meta: {
        title: '表单页'
      },
      children: [
        {
          path: 'baseForm',
          name: 'baseForm',
          meta: {
            title: '基础表单'
          },
          component: () => import('@/views/Form/BaseForm')
        },
        {
          path: 'stepForm',
          name: 'stepForm',
          meta: {
            title: '分步表单'
          },
          component: () => import('@/views/Form/StepForm')
        }
      ]
    },
    {
      path: '/list',
      name: 'list',
      component: RouterViewHoc,
      meta: {
        title: '列表页',
        menuLinkGroup: true
      },
      children: [
        {
          path: '',
          meta: {
            title: '列表'
          },
          component: () => import('@/views/List/Search')
        },
        {
          path: 'detail',
          meta: {
            menuIgnore: true,
            title: '详情'
          },
          component: () => import('@/views/Detail/BaseForm')
        }
      ]
    },
    {
      path: '/testVue1',
      name: 'testVue1',
      component: RouterViewHoc,
      meta: {
        title: 'testVue1',
        menuLinkGroup: true
      },
      children: [
        {
          path: '',
          name: 'test111',
          meta: {
            title: 'testVue'
          },
          component: () => import('@/views/Test/TestVue')
        },
      ]
    },
    {
      path: '/detail',
      name: 'detail',
      component: RouterViewHoc,
      meta: {
        title: '详情页'
      },
      children: [
        {
          path: 'baseForm',
          name: 'detailBaseForm',
          meta: {
            title: '表单详情'
          },
          component: () => import('@/views/Detail/BaseForm')
        },
        {
          path: 'testVue',
          name: 'testVue',
          meta: {
            title: 'test'
          },
          component: () => import('@/views/Test/TestVue')
        }
      ]
    },
    {
      path: '*',
      name: 'errorPage',
      component: ErrorPage,
      meta: {
        layout: 'Noop',
        menuIgnore: true
      }
    }
  ]
})

export default router
