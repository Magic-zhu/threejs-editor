//@ts-ignore
import {
  AmbientLight,
  Color,
  Intersection,
  Object3D,
  PMREMGenerator,
  sRGBEncoding,
  Scene,
  GridHelper,
  PerspectiveCamera,
  WebGLRenderer,
  Cache,
  PointLight,
  DirectionalLight,
  HemisphereLight,
  RectAreaLight,
  SpotLight,
  Vector3,
  ACESFilmicToneMapping,
  MathUtils,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import Loader, { ModelType } from "./loader"
import Selector from "./selector"
import Store, { SelectMode } from "../data/"
import Task, { TaskStatus, TaskType } from "./task"
import Model from "./model"
import { findIndex, findUntilParentScene, throttle } from "../util"
import { TransformControls } from "three/examples/jsm/controls/TransformControls"
import Stats from "three/examples/jsm/libs/stats.module"
import IO from "../io/index"
import { Sky } from "three/examples/jsm/objects/Sky"

export interface Options {
  // 编辑器背景颜色
  backgroundColor?: Color
  // 编辑器透明度
  backgroundAlpha?: number
  // 是否显示性能监控
  fps?: boolean
  // 性能监控初始化类型
  statsMode?: number
  // 是否打印数据变化
  dataChange?: boolean
  // 默认环境光 - 是否启用室内光
  roomEnvironment?: boolean
  // 相机参数设置
  cameraFov?: number
  cameraAspect?: number
  cameraNear?: number
  cameraFar?: number
  // 色彩空间 是否线性
  enableLinearOutPutEncode?: boolean
  // 内存缓存
  cache?: boolean
  // 天空
  sky?: boolean
}
export enum LightType {
  "POINT" = "point",
  "DIRECTIONAL" = "Directional",
  "HEMISPHERE" = "Hemisphere",
  "RECTAREA" = "reactarea",
  "SPOT" = "spot",
}

class Schedule {
  _data: Store = new Store()
  // 代理真实数据仓库 方便监听数据变动
  data: Store = new Proxy(this._data, this._data.dataOnChange())
  // 文件加载器
  file = new Loader()
  // 任务队列
  taskQueue: Task[] = new Proxy([], {})
  // 当前操作对象
  INTERSECTED: any = undefined
  // 发布订阅
  io = IO

  // # 生命周期
  onUpdate: Function = () => {}

  init(container: Element, options: Options = {}) {
    // * 缓存设置
    Cache.enabled = options.cache !== undefined ? options.cache : false
    // ! 先销毁一下listener和dispose一下资源
    this.destroy()
    // * 监听任务完成
    IO.on(
      "task_exit",
      throttle(() => {
        // todo 暂时靠脏检查释放任务
        const len = this.taskQueue.length
        if (len >= 20) {
          for (let i = 0; i < len; i++) {
            if (this.taskQueue[i] === undefined) break
            if (this.taskQueue[i].status === TaskStatus.FINISHED) {
              this.taskQueue.splice(i, 1)
              i--
            }
          }
        }
      }, 4000)
    )
    // * 设置配置表
    this.data.options = { ...options }
    // @ts-ignore
    // * 性能监控插件
    const stats: Stats = new Stats()
    if (options.statsMode === undefined) {
      stats.setMode(2)
    } else {
      stats.setMode(options.statsMode)
    }
    if (options.fps) {
      container.appendChild(stats.dom)
    }
    // * 场景对象
    const scene = new Scene()
    // * 辅助网格
    const gridHelper = new GridHelper(300, 30, 0x00ff00)
    scene.add(gridHelper)
    // * 相机
    // ! 为了避免z-fighting问题 初始near设置的较大
    const camera = new PerspectiveCamera(
      options.cameraFov || 50,
      options.cameraAspect || 1,
      options.cameraNear || 10,
      options.cameraFar || 10000
    )
    // * 天空
    if (options.sky !== false) {
      const sky = this.initSky()
      sky.name = "天空"
      scene.add(sky)
    }
    // * 渲染器
    const renderer = new WebGLRenderer({ antialias: true })
    // * 视角控制器
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    // * 拖动控制器
    const transformController = new TransformControls(
      camera,
      renderer.domElement
    )
    transformController.addEventListener("dragging-changed", function (event) {
      orbitControls.enabled = !event.value
    })
    scene.add(transformController)
    // * 相机参数设置
    camera.position.set(200, 200, 500) //设置相机位置
    camera.lookAt(scene.position)
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    // * 选择器
    const selector = new Selector(container, camera, scene, this.data)
    // @ 注册鼠标移动事件
    selector.setCallback("mousemove", (results: Intersection[]) => {
      IO.emit("mousemove", results)
    })
    // @ 注册鼠标单击事件
    selector.setCallback("click", (results: Intersection[]) => {
      IO.emit("click", results)
      if (results.length > 0) {
        const target =
          this.data.selectMode === SelectMode.GROUP
            ? findUntilParentScene(results[0].object)
            : results[0].object
        if (this.INTERSECTED != target) {
          if (this.INTERSECTED) {
            transformController.detach()
          }
          this.INTERSECTED = target
          transformController.attach(this.INTERSECTED)
        }
      } else {
        if (this.INTERSECTED) transformController.detach()
        this.INTERSECTED = null
      }
    })

    // * 渲染器参数设置
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(
      options.backgroundColor || 0x333333,
      options.backgroundAlpha !== undefined ? options.backgroundAlpha : 1
    )

    // * 天空相关太阳参数 */
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.5

    // ! 默认启用人类感知色彩空间
    if (!options.enableLinearOutPutEncode) {
      renderer.outputEncoding = sRGBEncoding
    }
    // * 光源
    if (options.roomEnvironment) {
      // info 如果需要设置室内环境
      const pmremGenerator = new PMREMGenerator(renderer)
      scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
      ).texture
    } else {
      const ambientLight = new AmbientLight(0xffffff)
      scene.add(ambientLight)
    }
    // * 插入画布
    container.appendChild(renderer.domElement)

    // 监听窗口尺寸变化，自适应渲染
    window.onresize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      //窗口宽高比
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
    }

    // * 渲染
    const render = () => {
      requestAnimationFrame(render)
      // 更新
      this.onUpdate()
      // 场景渲染
      renderer.render(scene, camera)
      // 刷新帧数
      if (options.fps) {
        stats.update()
      }
    }

    render()
    this.data.scene = scene
    this.data.gridHelper = gridHelper
    this.data.camera = camera
    this.data.renderer = renderer
    this.data.orbitControls = orbitControls
    this.data.transformController = transformController
    this.data.selector = selector
  }

  destroy() {
    this.data.selector?.destroy()
    this.data.orbitControls?.dispose()
    this.data.transformController?.dispose()
    IO.clear()
  }

  initSky() {
    const sky = new Sky()
    const sun = new Vector3()
    const effectController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 2,
      azimuth: 180,
    }
    sky.scale.setScalar(450000)
    const uniforms = sky.material.uniforms
    uniforms["turbidity"].value = effectController.turbidity
    uniforms["rayleigh"].value = effectController.rayleigh
    uniforms["mieCoefficient"].value = effectController.mieCoefficient
    uniforms["mieDirectionalG"].value = effectController.mieDirectionalG

    const phi = MathUtils.degToRad(90 - effectController.elevation)
    const theta = MathUtils.degToRad(effectController.azimuth)
    sun.setFromSphericalCoords(1, phi, theta)
    uniforms["sunPosition"].value.copy(sun)
    return sky
  }

  getAllObjects(): Object3D[] {
    if (this.data.scene) {
      return this.data.scene?.children.filter(
        (child) =>
          child.uuid !== this.data.transformController?.uuid &&
          child.uuid !== this.data.gridHelper?.uuid
      )
    }
    return []
  }

  async file_load(path: string, type: ModelType | string) {
    const loadTask = new Task(TaskType.FILE_LOAD, async (): Promise<Model> => {
      return await this.file.load(path, type)
    })
    this.taskQueue.push(loadTask)
    await loadTask.do()
    return loadTask.payload.result
  }

  model_add(obj: Object3D) {
    const modelAddTask = new Task(TaskType.MODEL_ADD, () => {
      this.data.modelGroup.push(obj)
      this.data.scene && this.data.scene.add(obj)
      return "success"
    })
    modelAddTask.doSync()
  }

  model_remove(obj: Object3D) {
    const modelRemoveTask = new Task(TaskType.MODEL_REMOVE, () => {
      const index = findIndex(obj, this.data.modelGroup, "uuid")
      this.data.modelGroup.splice(index, 1)
      this.data.scene && this.data.scene.remove(obj)
      return "success"
    })
    modelRemoveTask.doSync()
  }

  model_get(id: string) {
    const task = new Task(TaskType.MODEL_GET, () => {
      const index = findIndex({ uuid: id }, this.data.modelGroup, "uuid")
      return this.data.modelGroup[index]
    })
    task.doSync()
  }

  model_get_all() {
    const task = new Task(TaskType.MODEL_GET, () => {
      return this.data.modelGroup
    })
    task.doSync()
  }

  model_copy(obj: Object3D) {
    const task = new Task(TaskType.MODEL_COPY, () => {
      this.data.copyObj = obj
      return "success"
    })
    task.doSync()
  }

  view_change(x: number, y: number, z: number) {
    const viewChangeTask = new Task(TaskType.VIEW_CHANGE, () => {
      if (this.data.camera && this.data.scene) {
        this.data.camera.position.set(x, y, z)
        this.data.camera.lookAt(this.data.scene.position)
      }
      return "success"
    })
    viewChangeTask.doSync()
  }

  selector_mode_set(mode: SelectMode) {
    const task = new Task(TaskType.SELECTOR_MODE_CHANGE, () => {
      this.data.selectMode = mode
      return "success"
    })
    task.doSync()
  }

  /**
   *  API refer to Light
   * */
  light_add(type: LightType, pos: Vector3, options?: any) {
    let light: any
    switch (type) {
      case LightType.POINT:
        light = new PointLight(options)
        break
      case LightType.DIRECTIONAL:
        light = new DirectionalLight(options)
        break
      case LightType.HEMISPHERE:
        light = new HemisphereLight(options)
        break
      case LightType.RECTAREA:
        light = new RectAreaLight(options)
        break
      case LightType.SPOT:
        light = new SpotLight(options)
        break
      default:
        break
    }
    const task = new Task(TaskType.LIGHT_ADD, () => {
      this.data.scene?.add(light)
      return "success"
    })
    task.doSync()
  }
}

export default Schedule
