<template>
  <div class="tree-wrapper">
    <div v-for="(item,index) in data">
      <treeChild />
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue"

export default defineComponent({
  name: "Tree",
  props: {
    data: Array,
  }
})
</script>

<style scoped lang="less">

</style>
