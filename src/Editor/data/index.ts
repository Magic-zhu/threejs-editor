import {Scene, GridHelper, PerspectiveCamera, WebGLRenderer, Object3D} from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {TransformControls} from 'three/examples/jsm/controls/TransformControls'
import {chalk} from '../util'
import Selector from "../schedule/selector";

export enum SelectMode {
    'GROUP' = 'group', // 可以选中group
    'SINGLE' = 'single', // 选中单个
    'SIMPLE' = 'simple', // 无法选中Group类型 不检查子元素 性能较好
    'NONE' = 'none', // 无法选中
}

class Store {
    scene?: Scene
    gridHelper?: GridHelper
    camera?: PerspectiveCamera
    renderer?: WebGLRenderer
    orbitControls?: OrbitControls
    transformController?: TransformControls
    modelGroup: Object3D [] = new Proxy([], this.dataOnChange())
    options:any = new Proxy({},this.dataOnChange())
    selectMode:string = SelectMode.GROUP
    selector?:Selector
    // 复制的对象
    copyObj?:Object3D
    // 是否属于开发模式
    dev:boolean = false
    constructor() {

    }

    dataOnChange(){
        return {
            get: (target: any, prop: string, receiver: any) => {
                return Reflect.get(target, prop, receiver);
            },
            set: (target: any, prop: string, value: any, receiver: any) => {
                if (![
                    'scene',
                    'gridHelper',
                    'camera',
                    'renderer',
                    'orbitControls',
                    'selector',
                ].includes(prop) && this.options.dataOnChange && this.options.dev) {
                    chalk('green', `[data change]:${prop}`, value)
                    chalk('blue','target')
                    console.log(target)
                }
                return Reflect.set(target, prop, value, receiver);
            },
        }
    };
}

export default Store
