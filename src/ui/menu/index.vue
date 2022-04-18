<template>
  <div class="menu-wrapper">
        <div v-for="(item,index) in menus" class="menu-item" @click="handleMenuHover(index)">
        {{item.label}}
        <div class="sub-menu" v-if="activeHoverIndex===index">
          <span v-for="menu in item.children" :class="getClassByMenuType(menu.type)">导入</span>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Menu",
  data(){
    return {
      menus:[
        {
          label:'文件',
          children:[
            {
              label:'文件',
            },
            {},
          ],
        },
        {
          label:'编辑',
          children:[],
        },
      ],
      activeHoverIndex:-1,
    }
  },
  methods:{
    getClassByMenuType(type:string){
      switch (type){
        case "divide":
          return "sub-menu-item-divide"
        default:
          return "sub-menu-item"
      }
    },
    handleMenuHover(index:number):void{
      if(index === this.activeHoverIndex) this.activeHoverIndex = -1
      this.activeHoverIndex = index
    },
  }
}
</script>

<style scoped lang="less">
  .menu-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    .menu-item{
      width: 50px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: default;
      position: relative;
      &:hover {
        background-color: var(--bg);
      }

      .sub-menu {
        width:200px;
        display: flex;
        flex-direction: column;
        position:absolute;
        top:35px;
        left:0;
        background-color: var(--bg);
        z-index: 2;
        .sub-menu-item {
          height: 35px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          &:hover {
            background-color: var(--primary);
          }
        }
      }
    }
  }
</style>
