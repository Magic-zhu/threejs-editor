<template>
  <div id="editor">
    <div class="header"><Menu /></div>
    <div class="body">
      <div class="left-panel">
        <LeftPanel></LeftPanel>
      </div>
      <div class="split-line-left"></div>
      <div class="content"></div>
      <div class="split-line-right"></div>
      <div class="right-panel">
        <Explorer :list="sceneList" />
      </div>
    </div>
    <div class="status-bar">
      <div class="version">Ver{{ version }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue"
import Editor, { Vector3 } from "./Editor/index"
import Cache from "./plugins/Cache"
import Explorer from "./ui/explorer/index.vue"
import Menu from "./ui/menu/index.vue"
import LeftPanel from "./ui/LeftPanel/index.vue"
import { Object3D } from "three"
import { ref } from "vue"

export default defineComponent({
  props: {
    // * 整个编辑器的初始化配置项
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    Explorer: Explorer,
    Menu: Menu,
    LeftPanel,
  },
  setup() {
    let editor: Editor
    let sceneList = ref<Object3D[]>([])
    const init = (editor: Editor) => {
      const objs = editor.getAllObjects()
      sceneList.value = objs
    }
    onMounted(async () => {
      console.log("onMounted")
      const content: Element = document.getElementsByClassName("content")[0]
      editor = new Editor(content, {})
      editor.use(new Cache())
      const worker = await editor.file.load("/models/worker.dae", "collada")
      const worker2 = await editor.file.load("/models/worker.dae", "collada")
      const worker3 = await editor.file.load("/models/worker.dae", "collada")
      worker.position = new Vector3(-100, 0, 100)
      worker2.position = new Vector3(-100, 0, 110)
      worker3.position = new Vector3(-100, 0, 120)
      editor.model.add(worker.self)
      editor.model.add(worker2.self)
      editor.model.add(worker3.self)
      editor.hook.onUpdated(() => {})
      init(editor)
    })
    onUnmounted(() => {
      console.log("onUnmounted")
      editor.destroy()
    })
    return {
      version: "1.0.0",
      sceneList,
    }
  },
})
</script>

<style scoped lang="less">
@import "./style/theme.css";
@import "./style/index.less";
</style>
