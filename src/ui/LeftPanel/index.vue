<template>
  <div class="left-panel-wrapper">
    <!-- 侧边栏 -->
    <SideBar></SideBar>
    <!-- 资源管理器 -->
    <ResourceManager></ResourceManager>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import SideBar from "./SideBar.vue"
import ResourceManager from "./ResourceManager.vue"
export default defineComponent({
  components: {
    SideBar,
    ResourceManager,
  },
  setup() {
    return {}
  },
})
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
