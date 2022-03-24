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
import {defineComponent, onMounted} from "vue";
import Editor from "./Editor/index"
import * as THREE from "three";

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
      tree.self.scale.set(30,30,30);
      tree.self.position.set(100,0,100);
      vtk.self.scale.multiplyScalar(0.1);
      tokyo.self.position.set(-5,0,0);
      tokyo.self.scale.set(0.1,0.1,0.1);
      vtk.self.position.set(0,0,-100);
      const geometry = new THREE.BoxGeometry( 20, 20, 20 );
      for ( let i = 0; i < 10; i ++ ) {
        const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x000000 } ) );
        object.position.x = Math.random() * 200 - 100;
        object.position.y = 10;
        object.position.z = Math.random() * 200 - 100;
        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        editor.model.add(object);
      }
      editor.model.add(tree.self);
      editor.model.add(vtk.self);
      editor.model.add(tokyo.self);
      setTimeout(() => {
        editor.view.toX();
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
