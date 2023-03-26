<template>
  <div class="resource-manager-wrapper">
    <div class="resource-list">
      <div class="resource" @dragstart="dragStart">
        <img src="/images/demo.png" alt="" />
      </div>
      <div class="resource"><img src="/images/demo.png" alt="" /></div>
    </div>
    <div class="resource-list">
      <div class="resource"><img src="/images/demo.png" alt="" /></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
  setup() {
    return {
      dragStart() {},
    }
  },
})
</script>
<style lang="less" scoped>
@import "./ResourceManager.less";
</style>
