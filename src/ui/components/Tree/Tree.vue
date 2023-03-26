<template>
  <div class="tree-wrapper">
    <TreeChild
      v-for="(item, index) in list"
      :info="item"
      class="top-level"
      :level="0"
    ></TreeChild>
  </div>
</template>

<script>
import { defineComponent } from "vue"
import TreeChild from "./TreeChild.vue"
export default defineComponent({
  name: "Tree",
  components: {
    TreeChild,
  },
  props: {
    list: Array,
  },
  setup(props) {
    console.log(props.list)
  },
})
</script>

<style scoped lang="less">
.tree-wrapper {
  .top-level {
    margin-left: 10px;
  }
}
</style>
