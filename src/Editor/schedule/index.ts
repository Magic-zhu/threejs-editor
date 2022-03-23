//@ts-ignore
import * as THREE from "three";
import {Color, Intersection, Object3D, AmbientLight} from "three";
import {OrbitControls} from "@three-ts/orbit-controls";
import Loader, {ModelType} from "./loader";
import Selector from "./selector";
import Store from "../data/";
import Task, {TaskType} from "./task";
import Model from './model'
import {findIndex} from '../util'


interface Options {
    backgroundColor?: Color
    backgroundAlpha?: number
}

class Schedule {
    _data: Store = new Store();
    // 代理真实数据仓库 方便监听数据变动
    data: Store = new Proxy(this._data, this._data.dataOnChange());
    file = new Loader();
    taskQueue: Task[] = [];

    initEditor(container: Element, options: Options = {}) {
        // * 场景对象
        const scene = new THREE.Scene();
        // * 辅助网格
        const gridHelper = new THREE.GridHelper(10, 25);
        scene.add(gridHelper);
        // * 相机
        const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);
        // * 光源
        const ambientLight = new AmbientLight(0xffffff);
        scene.add(ambientLight);
        // * 渲染器
        const renderer = new THREE.WebGLRenderer();
        // * 视角控制器
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        // * 拖动控制器
        // const transformController = new TransformControls( camera, renderer.domElement );
        // transformController.addEventListener( 'change', render );
        // transformController.addEventListener( 'dragging-changed', function ( event ) {
        //   orbitController.enabled = ! event.value;
        // } );
        // scene.add(tree);
        // transformController.attach(tree);
        // scene.add(transformController);
        // * 相机参数设置
        camera.position.set(8, 8, 8); //设置相机位置
        camera.lookAt(scene.position);
        camera.aspect = container.clientWidth / container.clientHeight;
        // * 选择器
        const selector = new Selector(camera, scene, []);
        selector.setCallback('mousemove', (results: Intersection[]) => {
            if (results.length > 0) {
                console.log(results[0].object);
                results[0].object.position.x = 0.5
            }
        });
        // * 渲染器参数设置
        renderer.setSize(800, 800);
        renderer.setClearColor(
            options.backgroundColor || 0x333333,
            options.backgroundAlpha !== undefined ? options.backgroundAlpha : 1
        );
        // * 插入画布
        container.appendChild(renderer.domElement);

        // * 渲染
        function render() {
            renderer.render(scene, camera);
            // 每帧渲染
            requestAnimationFrame(render);
        }

        render();
        this.data.scene = scene;
        this.data.gridHelper = gridHelper;
        this.data.camera = camera;
        this.data.renderer = renderer;
        this.data.orbitControls = orbitControls;
    }

    async file_load(path: string, type: ModelType | string) {
        const loadTask = new Task(TaskType.FILE_LOAD, async (): Promise<Model> => {
            return await this.file.load(path, type)
        });
        this.taskQueue.push(loadTask);
        await loadTask.do();
        return loadTask.payload.result;
    }

    model_add(obj: Object3D) {
        const modelAddTask = new Task(TaskType.MODEL_ADD, () => {
            this.data.modelGroup.push(obj);
            this.data.scene && this.data.scene.add(obj);
            return 'success'
        });
        modelAddTask.doSync();
        this.taskQueue.push(modelAddTask);
    }

    model_remove(obj: Object3D) {
        const modelRemoveTask = new Task(TaskType.MODEL_REMOVE, () => {
            const index = findIndex(obj, this.data.modelGroup, 'uuid')
            this.data.modelGroup.splice(index, 1);
            this.data.scene && this.data.scene.remove(obj);
            return 'success'
        });
        modelRemoveTask.doSync();
        this.taskQueue.push(modelRemoveTask);
    }
}

export default Schedule;
