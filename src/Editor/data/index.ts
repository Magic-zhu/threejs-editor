import {Scene, GridHelper, PerspectiveCamera, WebGLRenderer, Object3D} from 'three'
import {OrbitControls} from '@three-ts/orbit-controls'
import {TransformControls} from 'three/examples/jsm/controls/TransformControls'

//@ts-ignore
import chalk from 'chalk-web';

export enum SelectMode {
    'GROUP' = 'group', // 可以选中group
    'SINGLE' = 'single', // 选中单个
    'SIMPLE' = 'simple', // 无法选中Group类型 不检查子元素 性能较好
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
                ].includes(prop) && this.options.dataOnChange) {
                    chalk('green', `[data change]:${prop}`, value)
                    console.log(target)
                }
                return Reflect.set(target, prop, value, receiver);
            },
        }
    };
}

export default Store