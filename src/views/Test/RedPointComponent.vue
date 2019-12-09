<template>
    <span>
        <slot :text="redval"></slot>
    </span>
</template>

<script>
  export default {
    name: "RedPoint",
    props: ['redval']
  }
</script>

<style scoped>

</style>
