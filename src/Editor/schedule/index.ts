//@ts-ignore
import * as THREE from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import Loader from "./loader";
import { Intersection, Object3D } from "three";
import Selector  from "./selector";
import Store  from "../data/";
import Task from "./task";
class Schedule {
  _data:Store= new Store();
  // 代理真实数据仓库 方便监听数据变动
  dataOnChange = {
    get:(target:any,prop:string)=>{
      return target[prop];
    }
  };
  data = new Proxy(this._data,this.dataOnChange);
  taskQueue:Task[] = [];

  async initEditor(container: Element,options:any = {}) {
    // * 场景对象
    const scene = new THREE.Scene();
    // * 辅助网格
    const gridHelper = new THREE.GridHelper(10, 25);
    scene.add(gridHelper);
    // * 相机
    const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);
    // * 渲染器
    const renderer = new THREE.WebGLRenderer();
    // * 视角控制器
    let orbitController
    if(options.OrbitControls!==false){
      orbitController  = new OrbitControls(camera, renderer.domElement);
    }
    // * 拖动控制器
    const transformController = new TransformControls( camera, renderer.domElement );
    transformController.addEventListener( 'change', render );
    transformController.addEventListener( 'dragging-changed', function ( event ) {
      orbitController.enabled = ! event.value;
    } );
    const tree: Object3D = await new Loader(
      "/models/tree.obj",
      "obj"
    ).loadModel();
    scene.add(tree);
    transformController.attach(tree);
    scene.add(transformController);
    // * 相机参数设置
    camera.position.set(8, 8, 8); //设置相机位置
    camera.lookAt(scene.position);
    camera.aspect = container.clientWidth / container.clientHeight;
    // * 选择器
    const selector = new Selector(camera, scene, [tree]);
    selector.setCallback('mousemove',(results: Intersection[]) => {
      if (results.length > 0) {
        console.log(results[0].object);
        results[0].object.position.x = 0.5
      }
    });
    // * 渲染器参数设置
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x333333, 1);
    // * 插入画布
    container.appendChild(renderer.domElement);
    // * 渲染
    function render(){
      renderer.render(scene, camera);
      // 每帧渲染
      requestAnimationFrame(render);
    };
    render();
  }

  // *  ----------------
  // *  数据相关操作
  // *  ----------------

  data_save() {

  }

  data_update() {

  }

  data_delete() {

  }

  // *  ----------------
  // *  任务相关操作
  // *  ----------------
  task_create() {

  }

  task_exit() {

  }

  task_join() {

  }

  task_destroy() {

  }
}

export default  Schedule;
