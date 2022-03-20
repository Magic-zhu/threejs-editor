//@ts-ignore
import * as THREE from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
import Loader from "./loader";
import { Intersection, Object3D } from "three";
import {Selector} from "./selector";
import {Store} from "../data/index";
export interface Task {
    // 任务id
    pid:string;
    // 任务开始时间
    beginTime: number;
    // 任务结束时间
    finishTime: number;
    // 任务发起时间
    launchTime: number;
    // 负载数据
    payload:any;
}
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
  async initEditor(container: Element) {
    // * 场景对象
    const scene = new THREE.Scene();
    // * 辅助网格
    const gridHelper = new THREE.GridHelper(10, 25);
    // * 相机
    const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);
    // * 渲染器
    const renderer = new THREE.WebGLRenderer();
    // * 控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    scene.add(gridHelper);
    const tree: Object3D = await new Loader(
      "/models/tree.obj",
      "obj"
    ).loadModel();
    scene.add(tree);
    // * 相机参数设置
    camera.position.set(8, 8, 8); //设置相机位置
    camera.lookAt(scene.position);
    camera.aspect = container.clientWidth / container.clientHeight;
    // * 选择器
    const selector = new Selector(camera, scene, [tree]);
    selector.setCallback((results: Intersection[]) => {
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
    const render = () => {
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

  tash_destory() {

  }
}

export { Schedule };
