<template>
  <div id="app">
    <Noop v-if="layout === 'Noop'"></Noop>
    <Common v-else app-name="appName"></Common>
  </div>
</template>

<script>
import Common from '@/layouts/Common'
import Noop from '@/layouts/Noop'

export default {
  name: 'App',
  components: {
    Common,
    Noop
  },
  computed: {
    layout() {
      return this.$route.meta.layout || 'Common'
    }
  }
}
</script>
<style lang="scss" src="@/assets/styles/index.scss">
</style>
