<template>
  <div class="tree-child-wrapper">
    <div class="parent" :style="styles">
      <!-- 收起图标 -->
      <Icon
        v-show="info.children.length > 0 && !expanding"
        style="padding-right: 5px"
        class="expand-icon"
        @click="expand(true)"
      >
        <svg
          t="1679815837053"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="9950"
          width="128"
          height="128"
        >
          <path
            d="M70.4 153.6c0-45.9264 37.2736-83.2 83.2-83.2h716.8c45.9264 0 83.2 37.2736 83.2 83.2v716.8c0 45.9264-37.2736 83.2-83.2 83.2H153.6A83.2 83.2 0 0 1 70.4 870.4V153.6z m64 0v716.8c0 10.5984 8.6016 19.2 19.2 19.2h716.8a19.2 19.2 0 0 0 19.2-19.2V153.6A19.2 19.2 0 0 0 870.4 134.4H153.6A19.2 19.2 0 0 0 134.4 153.6z"
            fill="#ffffff"
            p-id="9951"
          ></path>
          <path
            d="M307.2 544a32 32 0 1 1 0-64h409.6a32 32 0 1 1 0 64H307.2z"
            fill="#ffffff"
            p-id="9952"
          ></path>
          <path
            d="M480 307.2a32 32 0 1 1 64 0v409.6a32 32 0 1 1-64 0V307.2z"
            fill="#ffffff"
            p-id="9953"
          ></path>
        </svg>
      </Icon>
      <!-- 占位图标 -->
      <Icon v-show="info.children.length === 0" style="padding-right: 5px">
        <svg
          t="1679815837053"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="9950"
          width="128"
          height="128"
        ></svg>
      </Icon>
      <!-- 展开图标 -->
      <Icon
        v-show="info.children.length > 0 && expanding"
        style="padding-right: 5px"
        class="expand-icon"
        @click="expand(false)"
      >
        <svg
          t="1679816168170"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="10147"
          width="128"
          height="128"
        >
          <path
            d="M252.928 475.136v74.24h518.144v-74.24h-518.144z m-73.728-295.936h665.6v666.112h-665.6V179.2z m-74.24-74.24V918.528h814.08v-814.08h-814.08z"
            p-id="10148"
            fill="#ffffff"
          ></path>
        </svg>
      </Icon>
      <Icon :scale="1">
        <svg
          t="1679812709060"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="8621"
          width="128"
          height="128"
        >
          <path
            d="M546.133333 167.253333l298.666667 170.666667V682.666667l-298.666667 170.666666-298.666666-170.666666V341.333333l298.666666-170.666666m0-85.333334a85.333333 85.333333 0 0 0-42.666666 11.52l-298.666667 170.666667A85.333333 85.333333 0 0 0 162.133333 341.333333v341.333334a85.333333 85.333333 0 0 0 42.666667 73.813333l298.666667 170.666667a85.333333 85.333333 0 0 0 85.333333 0l298.666667-170.666667a85.333333 85.333333 0 0 0 42.666666-73.813333V341.333333a85.333333 85.333333 0 0 0-42.666666-73.813333l-298.666667-170.666667a85.333333 85.333333 0 0 0-42.666667-11.52z"
            fill="#ffffff"
            p-id="8622"
          ></path>
          <path
            d="M503.466667 469.333333m42.666666 0l0 0q42.666667 0 42.666667 42.666667l0 341.333333q0 42.666667-42.666667 42.666667l0 0q-42.666667 0-42.666666-42.666667l0-341.333333q0-42.666667 42.666666-42.666667Z"
            fill="#ffffff"
            p-id="8623"
          ></path>
          <path
            d="M213.447266 357.644516m21.333333-36.950417l0 0q21.333333-36.950417 58.283751-15.617084l257.174904 148.48q36.950417 21.333333 15.617084 58.283751l0 0q-21.333333 36.950417-58.283751 15.617084l-257.174904-148.48q-36.950417-21.333333-15.617084-58.283751Z"
            fill="#ffffff"
            p-id="8624"
          ></path>
          <path
            d="M505.016389 475.026718m36.950417-21.333334l270.846559-156.373333q36.950417-21.333333 58.28375 15.617084l0 0q21.333333 36.950417-15.617084 58.283751l-270.846558 156.373333q-36.950417 21.333333-58.283751-15.617084l0 0q-21.333333-36.950417 15.617084-58.283751Z"
            fill="#ffffff"
            p-id="8625"
          ></path>
        </svg>
      </Icon>
      <span class="label">{{ info.name || info.type }}</span>
    </div>
    <div
      v-if="info.children.length > 0 && expanding"
      v-for="(item, index) in info.children"
    >
      <TreeChild :info="item" :level="level + 1" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue"
import { Icon } from "vexip-ui"

export default defineComponent({
  name: "TreeChild",
  props: {
    info: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      defaultValue: 0,
      required: true,
    },
  },
  components: {
    Icon,
  },
  setup(props) {
    const expanding = ref(true)
    const expand = (flag: boolean) => {
      expanding.value = flag
    }
    return {
      styles: computed(() => ({
        "padding-left": `${props.level * 20}px`,
      })),
      expanding,
      /* **** methods ****** */
      expand,
    }
  },
})
</script>

<style scoped lang="less">
.tree-child-wrapper {
  .parent {
    display: flex;
    font-size: 14px;
    align-items: center;
    .expand-icon {
      cursor: pointer;
    }
    .label {
      margin-left: 5px;
    }
  }
}
</style>
