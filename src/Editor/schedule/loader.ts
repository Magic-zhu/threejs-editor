import * as THREE from 'three'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {ColladaLoader} from 'three/examples/jsm/loaders/ColladaLoader.js';
import {PLYLoader} from 'three/examples/jsm/loaders/PLYLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Object3D} from "three";
export enum  ModelType{
    'stl'= 'stl',
    'obj'= 'obj',
    'mtl'= 'mtl',
    'fbx'= 'fbx',
    'collada'= 'collada',
    'ply'= 'ply',
    'gltf'= 'gltf',
}
class Loader {
    constructor(
        path:string,
        type: ModelType|string
    ) {
        this.path = path
    }
    path = ''
    type:ModelType|string = ModelType.obj
    _Obj_3D:Object3D|null = null
    loaderMap:any = {
        'obj': OBJLoader,
        'stl': STLLoader,
        'mtl': MTLLoader,
        'fbx': FBXLoader,
        'collada': ColladaLoader,
        'ply': PLYLoader,
        'gltf': GLTFLoader,
    }
    /**
     * 加载模型文件
     * @param path - 路径
     * @param type - 模型文件类型
     */
    async loadModel(path?: string, type?: ModelType|string):Promise<Object3D> {
        let _path:string = path || this.path;
        let _type:string = type || this.type;
        const loader = new this.loaderMap[_type]();
        return await new Promise((resolve => {
            loader.load(_path,(obj:Object3D)=>{
                this._Obj_3D = obj
                resolve(obj)
            })
        }))
    }
}

export default Loader;