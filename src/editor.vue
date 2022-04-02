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
      <div class="version">Ver{{ version }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";
import Editor from "./Editor/index";
import * as THREE from "three";
import Cache from "./plugins/Cache";

export default defineComponent({
  props: {
    // * 整个编辑器的初始化配置项
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    let editor: Editor;
    onMounted(async () => {
      console.log("onMounted");
      const content: Element = document.getElementsByClassName("content")[0];
      editor = new Editor(content, { fps: true });
      editor.use(new Cache());
      const tree = await editor.file.load("/models/tree.obj", "obj");
      const vtk = await editor.file.load("/models/liver.vtk", "vtk");
      const tokyo = await editor.file.load("/models/LittlestTokyo.glb", "gltf");
      tree.self.scale.set(30, 30, 30);
      tree.self.position.set(100, 0, 100);
      vtk.self.scale.multiplyScalar(0.1);
      vtk.self.position.set(-100, 0, -100);
      tokyo.self.position.set(0, 65, 0);
      tokyo.self.scale.set(0.3, 0.3, 0.3);
      editor.model.add(tree.self);
      editor.model.add(vtk.self);
      editor.model.add(tokyo.self);
      const clock = new THREE.Clock();
      const mixer = new THREE.AnimationMixer(tokyo.self);
      console.log(tokyo.origin)
      mixer.clipAction(tokyo.origin.animations[0]).play();
      editor.hook.onUpdated(() => {
        const delta = clock.getDelta();
        mixer.update(delta);
      });
      window.editor = editor;
    });
    onUnmounted(() => {
      console.log("onUnmounted");
      editor.destroy();
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
