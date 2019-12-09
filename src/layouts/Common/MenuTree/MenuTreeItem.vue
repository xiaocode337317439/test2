<template>
  <ul class="tree-list">
    <li
      v-for="(menu, i) in menus"
      :key="menu.path"
      class="tree-item"
      :class="`deep-${deep}`"
    >
      <router-link
        v-if="!menu.children || menu.linkGroup"
        :style="{ paddingLeft: (deep + 1) * 20 + 'px' }"
        :class="{ 'is-root': menu.path === '/', 'is-root-active': $route.path === '/' }"
        class="link"
        tag="div"
        :to="menu.linkGroup ? menu.linkGroup : menu.name ? { name: menu.name } : menu.path"
      >
        <i v-if="menu.icon" class="menu-icon" :class="menu.icon"></i>
        <span class="text" />
        {{ menu.title }}
      </router-link>
      <span
        v-else
        :style="{ paddingLeft: (deep + 1) * 20 + 'px' }"
        :class="{ expand: clone[i].expand }"
        class="button"
        @click="toggle(i)"
      >
        {{ menu.title }}
        <i class="expand-icon el-icon-arrow-right"></i>
      </span>
      <el-collapse-transition>
        <MenuTreeItem
          v-show="clone[i].expand"
          v-if="menu.children"
          :class="{ expand: clone[i].expand }"
          :menus="menu.children"
          :deep="deep + 1"
        />
      </el-collapse-transition>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'MenuTreeItem',
  props: {
    menus: {
      type: Array,
      default() {
        return []
      }
    },
    deep: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 生成一个和menus对应的expand列表
      clone: this.menus.map(v => ({
        expand: v.expand
      }))
    }
  },
  watch: {
    // 自动展开当前激活路由的上层折叠
    $route: {
      handler(val) {
        this.menus.forEach((v, i) => {
          const cloneItem = this.clone[i]
          if (!cloneItem.expand && val.path.indexOf(v.path) === 0) {
            cloneItem.expand = true
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    toggle(index) {
      const item = this.clone[index]
      item.expand = !item.expand
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/config';
.tree-list {
  transition: all 0.2s;
  transform-origin: top;
}
.button,
.link {
  line-height: 48px;
  color: #b1b1b1;
  cursor: pointer;
  background-color: #23262b;
  &:hover {
    color: white;
    background-color: #1e2125;
  }
}
.menu-icon {
  margin-right: 5px;
}

.expand-icon {
  margin-right: 10px;
}
.button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  .expand-icon {
    transition: transform 0.2s;
  }
}
.button.expand {
  color: white;
  .expand-icon {
    transform: rotate(90deg);
  }
}
.deep-2 .link {
  background-color: #2e3136;
}
.link.is-root-active.is-root,
.link.router-link-active:not(.is-root) {
  background-color: $theme-color;
  color: white;
}
</style>
