<template>
  <div>{{ msg }}</div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
//@ts-ignore
import * as THREE from "three";

export default defineComponent({
  setup() {
    onMounted(() => {
      const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
      );
      camera.position.z = 1;

      const scene = new THREE.Scene();

      const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const material = new THREE.MeshNormalMaterial();

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setAnimationLoop(animation);
      document.body.appendChild(renderer.domElement);

      // animation

      function animation(time) {
        mesh.rotation.x = time / 2000;
        mesh.rotation.y = time / 1000;

        renderer.render(scene, camera);
      }
    });
    return {
      msg: "ces",
    };
  },
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
