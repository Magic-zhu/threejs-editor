<template>
  <div id="editor">
    <div class="header"></div>
    <div class="body">
      <div class="left-panel"></div>
      <div class="split-line-left">
        <div class="split-line-inside"></div>
      </div>
      <div class="content"></div>
      <div class="split-line-right">
        <div class="split-line-inside"></div>
      </div>
      <div class="right-panel"></div>
    </div>
    <div class="status-bar">
      <div class="version">version {{ version }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { Editor } from "./Editor/index";
export default defineComponent({
  props: {
    // * 整个编辑器的初始化配置项
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {

    let editor;
    onMounted(() => {
      const content: Element = document.getElementsByClassName("content")[0];
      editor = new Editor(content);
    });
    return {
      version: "1.0.0",
    };
  },
});
</script>

<style scoped lang="less">
@import "./style/index.less";
@import "./style/theme.css";
</style>
