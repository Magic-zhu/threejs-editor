import { ModelType, loaderMap } from "./loader"
import {
  Object3D,
  MeshLambertMaterial,
  Mesh,
  BufferGeometry,
  Vector3,
} from "three"
import IO from "../io"

export enum ModelStatus {
  "READY" = 0,
  "FINISHED" = 1,
}

class Model {
  // 模型类型
  readonly type: ModelType | string = ModelType.obj
  uuid: string = ""
  self: Object3D | null = null
  // info 完整的数据
  origin: Object3D | null = null
  // 文件路径
  path: string = ""
  // 模型加载进度
  status: ModelStatus = ModelStatus.READY
  constructor(path: string, type: ModelType | string) {
    this.path = path
    this.type = type
  }
  /**
   * 初始化模型
   * @param path - 路径
   * @param type - 模型文件类型
   */
  async init(path?: string, type?: ModelType | string): Promise<Object3D> {
    let _path: string = path || this.path
    let _type: string = type || this.type
    IO.emit("model_load")
    const loader = new loaderMap[_type]()
    return new Promise((resolve) => {
      switch (_type) {
        case "vtk":
          loader.load(_path, (geometry: BufferGeometry) => {
            geometry.center()
            geometry.computeVertexNormals()
            const material = new MeshLambertMaterial({ color: 0x555555 })
            const mesh = new Mesh(geometry, material)
            mesh.position.set(0, 0, 0)
            this.self = mesh
            this.uuid = mesh.uuid
            this.status = ModelStatus.FINISHED
            resolve(mesh)
          })
          break
        case "collada":
          loader.load(_path, (collada: any) => {
            const model = collada.scene
            model.position.set(0, 0, 0)
            this.self = model
            this.uuid = model.uuid
            this.status = ModelStatus.FINISHED
            this.origin = collada
            resolve(model)
          })
          break
        case "gltf":
          const dracoLoader = new loaderMap["dracol"]()
          dracoLoader.setDecoderPath("/libs/draco/gltf/")
          loader.setDRACOLoader(dracoLoader)
          loader.load(_path, (gltf: any) => {
            const model = gltf.scene
            model.position.set(0, 0, 0)
            this.self = model
            this.uuid = model.uuid
            this.status = ModelStatus.FINISHED
            this.origin = gltf
            resolve(model)
          })
          break
        default:
          loader.load(_path, (obj: Object3D) => {
            this.self = obj
            this.uuid = obj.uuid
            this.status = ModelStatus.FINISHED
            resolve(obj)
          })
      }
    })
  }

  get position() {
    if (this.self) {
      return this.self?.position
    } else {
      return new Vector3(0, 0, 0)
    }
  }

  set position(v: Vector3) {
    this.self?.position.set(v.x, v.y, v.z)
  }
}

export default Model
