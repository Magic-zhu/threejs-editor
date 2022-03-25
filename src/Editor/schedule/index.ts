//@ts-ignore
import * as THREE from "three";
import {AmbientLight, Color, Intersection, Object3D} from "three";
import {OrbitControls} from "@three-ts/orbit-controls";
import Loader, {ModelType} from "./loader";
import Selector from "./selector";
import Store, {SelectMode} from "../data/";
import Task, {TaskStatus, TaskType} from "./task";
import Model from './model'
import {findIndex, findUntilParentScene, throttle} from '../util'
import {TransformControls} from 'three/examples/jsm/controls/TransformControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import IO from '../io/index'

export interface Options {
    // 编辑器背景颜色
    backgroundColor?: Color
    // 编辑器透明度
    backgroundAlpha?: number
    // 是否显示性能监控
    fps?:boolean
    // 是否打印数据变化
    dataChange?:boolean
}

class Schedule {
    _data: Store = new Store();
    // 代理真实数据仓库 方便监听数据变动
    data: Store = new Proxy(this._data, this._data.dataOnChange());
    // 文件加载器
    file = new Loader();
    // 任务队列
    taskQueue: Task[] = new Proxy([],{});
    // 当前操作对象
    INTERSECTED: any = undefined;

    init(container: Element, options: Options = {}) {
        // * 监听任务完成
        IO.on('task_exit',throttle((pid:string)=>{
            // todo 暂时靠脏检查释放任务
            const len = this.taskQueue.length;
            if(len>=20){
                for(let i = 0;i<len;i++){
                    if(this.taskQueue[i]===undefined) break
                    if(this.taskQueue[i].status===TaskStatus.FINISHED){
                        this.taskQueue.splice(i,1);
                        i--;
                    }
                }
            }
        },4000))
        // * 设置配置表
        this.data.options = {...options};
        // @ts-ignore
        // * 性能监控插件
        const stats:Stats = new Stats();
        stats.setMode(2);
        if(options.fps){
            container.appendChild(stats.dom)
        }
        // * 场景对象
        const scene = new THREE.Scene();
        // * 辅助网格
        const gridHelper = new THREE.GridHelper(300, 25, 0x0000ff);
        scene.add(gridHelper);
        // * 相机
        const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
        // * 光源
        const ambientLight = new AmbientLight(0xffffff);
        scene.add(ambientLight);
        // * 渲染器
        const renderer = new THREE.WebGLRenderer();
        // * 视角控制器
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        // * 拖动控制器
        const transformController = new TransformControls(camera, renderer.domElement);
        transformController.addEventListener('dragging-changed', function (event) {
            orbitControls.enabled = !event.value;
        });
        scene.add(transformController);
        // * 相机参数设置
        camera.position.set(200, 200, 200); //设置相机位置
        camera.lookAt(scene.position);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        // * 选择器
        const selector = new Selector(container, camera, scene, this.data);
        // @ 注册鼠标移动事件
        selector.setCallback('mousemove', (results: Intersection[]) => {
            IO.emit('mousemove',results)
        });
        // @ 注册鼠标单击事件
        selector.setCallback('click', (results: Intersection[]) => {
            if (results.length > 0) {
                const target = this.data.selectMode === SelectMode.GROUP?
                    findUntilParentScene(results[0].object):results[0].object;
                if (this.INTERSECTED != target) {
                    if (this.INTERSECTED) {
                        transformController.detach();
                    }
                    this.INTERSECTED = target;
                    transformController.attach(this.INTERSECTED);
                }
            } else {
                if (this.INTERSECTED) transformController.detach();
                this.INTERSECTED = null;
            }
        })
        // * 渲染器参数设置
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(
            options.backgroundColor || 0x333333,
            options.backgroundAlpha !== undefined ? options.backgroundAlpha : 1
        );
        // * 插入画布
        container.appendChild(renderer.domElement);

        // 监听窗口尺寸变化，自适应渲染
        window.onresize = () => {
            renderer.setSize(container.clientWidth, container.clientHeight);
            //窗口宽高比
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
        }

        // * 渲染
        function render() {
            renderer.render(scene, camera);
            // 刷新帧数
            if(options.fps){
                stats.update()
            }
            // 每帧渲染
            requestAnimationFrame(render);
        }

        render();
        this.data.scene = scene;
        this.data.gridHelper = gridHelper;
        this.data.camera = camera;
        this.data.renderer = renderer;
        this.data.orbitControls = orbitControls;
        this.data.transformController = transformController;
    }

    destroy() {

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
    }

    model_remove(obj: Object3D) {
        const modelRemoveTask = new Task(TaskType.MODEL_REMOVE, () => {
            const index = findIndex(obj, this.data.modelGroup, 'uuid')
            this.data.modelGroup.splice(index, 1);
            this.data.scene && this.data.scene.remove(obj);
            return 'success'
        });
        modelRemoveTask.doSync();
    }

    model_get_all() {
        const task = new Task(TaskType.MODEL_GET, () => {
            return this.data.modelGroup
        });
        task.doSync();
    }

    view_change(x:number,y:number,z:number) {
        const viewChangeTask = new Task(TaskType.VIEW_CHANGE, () => {
            if(this.data.camera && this.data.scene){
                this.data.camera.position.set(x,y,z);
                this.data.camera.lookAt(this.data.scene.position);
            }
            return 'success'
        });
        viewChangeTask.doSync();
    }

    selector_mode_set(mode:SelectMode) {
        const task = new Task(TaskType.SELECTOR_MODE_CHANGE, () => {
            this.data.selectMode = mode;
            return 'success'
        });
        task.doSync();
    }
}

export default Schedule;
