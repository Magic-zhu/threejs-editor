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
import {defineComponent, onMounted} from "vue";
import Editor from "./Editor/index"

export default defineComponent({
  props: {
    // * 整个编辑器的初始化配置项
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    onMounted(async () => {
      const content: Element = document.getElementsByClassName("content")[0];
      const editor = new Editor(content);
      const tree = await editor.file.load('/models/tree.obj', 'obj');
      const vtk = await editor.file.load('/models/liver.vtk', 'vtk');
      const tokyo = await editor.file.load('/models/LittlestTokyo.glb', 'gltf');
      vtk.self.scale.multiplyScalar(0.01);
      tokyo.self.position.set(-5,0,0);
      tokyo.self.scale.set(0.1,0.1,0.1);
      vtk.self.position.set(0,0,-2.5);
      editor.model.add(tree.self);
      editor.model.add(vtk.self);
      editor.model.add(tokyo.self);
      setTimeout(() => {
        editor.model.remove(tree.self);
      }, 2000)
      window.editor = editor;
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
