<template>
  <div id="editor">
    <div class="header"></div>
    <div class="body">
      <div class="left-panel"></div>
      <div class="content"></div>
      <div class="right-panel"></div>
    </div>
    <div class="status-bar">
      <div class="version">version {{version}}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
//@ts-ignore
import * as THREE from "three";
import { OrbitControls } from '@three-ts/orbit-controls';
import Loader from './schedule/loader';
import {Object3D} from "three";
export default defineComponent({
  props:{
    // * 整个编辑器的初始化配置项
    config:{
      type:Object,
      default:()=>({}),
    },
  },
  setup() {
    // * 场景对象
    const scene = new THREE.Scene();
    // * 辅助网格
    const gridHelper = new THREE.GridHelper(10, 25);
    // * 相机
    const camera = new THREE.PerspectiveCamera(
        60,
        1,
        0.01,
        100,
    );
    // * 渲染器
    const renderer = new THREE.WebGLRenderer();
    // * 控制器
    const controls = new OrbitControls(camera,renderer.domElement);
    // * 初始化
    const init = async () =>{
      const content = document.getElementsByClassName('content')[0];
      scene.add(gridHelper);
      const tree:Object3D = await new Loader('/models/tree.obj','obj').loadModel()
      scene.add(tree)
      // * 相机参数设置
      camera.position.set(8, 8, 8); //设置相机位置
      camera.lookAt(scene.position);
      camera.aspect = content.clientWidth/content.clientHeight;
      // * 渲染器参数设置
      renderer.setSize(content.clientWidth,content.clientHeight);
      renderer.setClearColor(0x333333, 1);
      // * 插入画布
      content.appendChild(renderer.domElement);
    }
    // * 渲染
    const render = () => {
      renderer.render(scene, camera);
      // 每帧渲染
      requestAnimationFrame(render);
    }
    onMounted(() => {
      init()
      render()
    });
    return {
      version: '1.0.0',
    };
  },
});
</script>

<style scoped lang="less">
@import "./style/index.less";
</style>
