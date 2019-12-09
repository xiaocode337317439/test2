<template>
  <el-container class="main-container">
    <el-header class="header">
      <div class="left-box">
        <div class="logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="M213.333 874.667C96 874.667 0 778.667 0 661.333c0-76.8 42.667-147.2 106.667-185.6v-17.066c0-100.267 81.066-181.334 181.333-181.334 21.333 0 44.8 4.267 66.133 12.8C403.2 192 505.6 128 618.667 128c164.266 0 298.666 134.4 298.666 298.667v17.066C983.467 486.4 1024 561.067 1024 640c0 115.2-85.333 213.333-198.4 232.533-4.267 2.134-10.667 2.134-14.933 2.134H213.333zm-42.666-332.8c-51.2 19.2-85.334 66.133-85.334 119.466 0 70.4 57.6 128 128 128H806.4C881.067 780.8 938.667 716.8 938.667 640c0-57.6-34.134-110.933-85.334-134.4-17.066-8.533-27.733-25.6-23.466-44.8C832 448 832 437.333 832 426.667c0-117.334-96-213.334-213.333-213.334-93.867 0-174.934 59.734-202.667 149.334-4.267 12.8-14.933 23.466-27.733 27.733-12.8 4.267-27.734 2.133-38.4-6.4-17.067-12.8-38.4-21.333-59.734-21.333-55.466 0-98.133 42.666-98.133 96 0 10.666 2.133 19.2 4.267 29.866 6.4 21.334-4.267 44.8-25.6 53.334z"
            />
            <path
              fill="currentColor"
              d="M618.667 384c36.266 0 64 27.733 64 64 0 23.467 19.2 42.667 42.666 42.667S768 471.467 768 448c0-83.2-66.133-149.333-149.333-149.333-23.467 0-42.667 19.2-42.667 42.666S595.2 384 618.667 384"
            />
          </svg>
          <span class="oppo-cloud">appName</span>
        </div>
      </div>
      <div class="right-box">
        <div class="slot">
          <slot name="header"></slot>
        </div>
        <div v-if="userInfo" class="user-info">
          <i class="el-icon-user avatar"></i>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userInfo.user_name }}
              <i
                class="el-icon-arrow-down el-icon--right"
              ></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-container class="body">
      <el-aside
        v-if="!hideSidebar"
        class="sidebar"
        :width="`${sidebarExpand ? width : 0}px`"
      >
        <div class="sidebar-content">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <MenuTree :menus="menus"></MenuTree>
          </el-scrollbar>
        </div>
      </el-aside>
      <el-main class="main">
        <div
          v-if="!hideSidebar"
          class="collapse-btn"
          @click="sidebarExpand = !sidebarExpand"
        >
          <i class="el-icon-arrow-right icon"></i>
        </div>
        <div class="main-inner">
          <Breadcrumb v-if="!$route.meta.breadcrumbHide" class="breadcrumb"></Breadcrumb>
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import MenuTree from './MenuTree'
import Breadcrumb from './Breadcrumb'

export default {
  name: 'Common',
  components: {
    MenuTree,
    Breadcrumb
  },
  props: {
    hideSidebar: {
      type: Boolean,
      default: false
    },
    appName: {
      type: String,
      default: 'Protal'
    }
  },
  data() {
    return {
      sidebarExpand: true,
      width: 250
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    menus() {
      // 格式化router的option为菜单需要的树形结构, 所以理论上也可以不需要$router而直接传递option也可。
      // 使用$router的option来生成菜单面包屑的好处是一次配置即可，麻烦也在于限定了router的写法必须遵从某些规范
      return this.formatMenus(this.$router.options.routes)
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      const user = await this.$ajax.get(
        '/innerapi/blackcat/audit/get-login-user',
        {},
        { _ignoreMsg: true }
      )
      this.$store.registerModule('userInfo', {
        state: {
          ...user
        }
      })
    },
    async logout() {
      const { ssoUrl } = await this.$ajax.post(
        '/innerapi/blackcat/audit/audit-logout'
      )
      location.href = `${ssoUrl}/logout?service=${encodeURIComponent(
        location.href
      )}`
    },
    formatMenuLinkGroup(menu) {
      const { meta = {} } = menu.options
      if (meta.menuLinkGroup === void 0) return false
      if (meta.menuLinkGroup === true) return menu.path
    },
    formatMenus(menus = [], prefix = '/') {
      // 先处理是否存在路由配置穿透
      const filterMenus = []
      menus.forEach(v => {
        if (v.meta && v.meta.penetrate && v.children) {
          prefix = (prefix + v.path + '/').replace(/\/+/g, '/')
          v.children.forEach(vv => {
            filterMenus.push(vv)
          })
        } else {
          filterMenus.push(v)
        }
      })

      return filterMenus
        .filter(({ meta = {}, redirect }) => {
          return !meta.menuIgnore && !redirect
        })
        .map(v => {
          const { meta = {}, children, path, name } = v
          const item = {
            title: meta.title || '未命名',
            name,
            icon: meta.menuIcon,
            expand: meta.menuExpandDefault,
            path: (prefix + path).replace(/\/+/g, '/'),
            options: v
          }
          item.linkGroup = this.formatMenuLinkGroup(item)
          if (children && !meta.menuLinkGroup) {
            // 路径从上一层拼凑而来
            item.children = this.formatMenus(children, prefix + path + '/')
          }
          return item
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/config';
/deep/ {
  .el-scrollbar,
  .scrollbar-wrapper {
    height: 100%;
    overflow-x: hidden;
  }
}
.sidebar-content {
  height: 100%;
  width: 250px;
}
.main-container {
  height: 100%;
}
.breadcrumb {
  margin-bottom: 15px;
}
// 菜单栏样式
.sidebar {
  transition: width 0.5s ease;
  background: #23262b;
  padding-left: 0;
  padding-right: 0;
  position: relative;

  .sidebar-header {
    background: #1a1d20;
  }

  .app-name {
    line-height: 80px;
    color: white;
    font-weight: bold;
    padding-left: 20px;
    font-size: 22px;
  }
}
.header {
  background-color: white;
  display: flex;
  align-items: center;
  padding-left: 0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 100;
  .el-dropdown-link {
    cursor: pointer;
  }
  .user-info {
    display: flex;
    align-items: center;
  }
  .avatar {
    font-size: 24px;
    margin-right: 10px;
  }
  .left-box {
    width: 250px;
    display: flex;
    padding-left: 20px;
  }
  .right-box {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    color: $theme-color;
    display: flex;
    align-items: center;
    cursor: pointer;
    svg {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }
  }
  .oppo-cloud {
    font-size: 22px;
  }
  .cloud-menu-btn {
    width: 60px;
    line-height: 60px;
    font-size: 28px;
    text-align: center;
    color: white;
    cursor: pointer;
    margin-right: 20px;
    background-color: $theme-color;
  }
}
.body {
  height: calc(100vh - 60px);
  .main {
    position: relative;
    height: 100%;
    overflow-y: hidden;
    padding: 0;
    .main-inner {
      height: 100%;
      overflow-y: scroll;
      padding: 20px;
    }
    .collapse-btn {
      height: 50px;
      width: 0;
      top: 50%;
      position: absolute;
      border-bottom: 9px solid transparent;
      border-right: none;
      transform: translateY(-50%);
      left: -0;
      border-left: 13px solid #e6e6e7;
      border-top: 9px solid transparent;
      z-index: 1;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        position: relative;
        left: -7px;
        font-size: 12px;
        color: #999;
      }
      &:hover {
        height: 60px;
        transition: height 0.1s ease;
        border-left-color: #c3c2c2;
        .icon {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
}
</style>
