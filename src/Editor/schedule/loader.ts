import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {ColladaLoader} from 'three/examples/jsm/loaders/ColladaLoader.js';
import {PLYLoader} from 'three/examples/jsm/loaders/PLYLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {VTKLoader} from 'three/examples/jsm/loaders/VTKLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import { } from 'three/examples/jsm/loaders/3DMLoader'
import Model from "./model";
export enum  ModelType{
    'stl'= 'stl',
    'obj'= 'obj',
    'mtl'= 'mtl',
    'fbx'= 'fbx',
    'collada'= 'collada',
    'ply'= 'ply',
    'gltf'= 'gltf',
    'vtk' = 'vtk'
}
export const loaderMap:any = {
    'obj': OBJLoader,
    'stl': STLLoader,
    'mtl': MTLLoader,
    'fbx': FBXLoader,
    'collada': ColladaLoader,
    'ply': PLYLoader,
    'gltf': GLTFLoader,
    'vtk': VTKLoader,
    'dracol': DRACOLoader,
}
class Loader {
    async load(path:string,type: ModelType|string):Promise<Model>{
        const model = new Model(path,type);
        await model.init()
        return model
    }
}

export default Loader;
