import {Scene, GridHelper, PerspectiveCamera, WebGLRenderer, Object3D} from 'three'
import {OrbitControls} from '@three-ts/orbit-controls'
//@ts-ignore
import chalk from 'chalk-web';

class Store {
    scene?: Scene
    gridHelper?: GridHelper
    camera?: PerspectiveCamera
    renderer?: WebGLRenderer
    orbitControls?: OrbitControls
    modelGroup: Object3D [] = new Proxy([], this.dataOnChange())

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
                ].includes(prop)) {
                    chalk('green', `[data change]:${prop}`, value)
                    console.log(target)
                }
                return Reflect.set(target, prop, value, receiver);
            },
        }
    };
}

export default Store