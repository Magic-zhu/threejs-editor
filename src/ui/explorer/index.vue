<template>
  <div class="explore-wrapper">
    <div class="header">场景大纲</div>
    <div class="body">
      <Tree :list="list" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import Tree from "../components/Tree/Tree.vue"
export default defineComponent({
  props: {
    list: {
      type: Array,
    },
  },
  components: {
    Tree,
  },
  setup() {
    return {}
  },
})
</script>

<style scoped lang="less">
@import "explore.less";
</style>
