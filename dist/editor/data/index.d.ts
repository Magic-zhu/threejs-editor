import { Scene, GridHelper, PerspectiveCamera, WebGLRenderer, Object3D } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import Selector from "../schedule/selector";
export declare enum SelectMode {
    'GROUP' = "group",
    'SINGLE' = "single",
    'SIMPLE' = "simple",
    'NONE' = "none"
}
declare class Store {
    scene?: Scene;
    gridHelper?: GridHelper;
    camera?: PerspectiveCamera;
    renderer?: WebGLRenderer;
    orbitControls?: OrbitControls;
    transformController?: TransformControls;
    modelGroup: Object3D[];
    options: any;
    selectMode: string;
    selector?: Selector;
    constructor();
    dataOnChange(): {
        get: (target: any, prop: string, receiver: any) => any;
        set: (target: any, prop: string, value: any, receiver: any) => boolean;
    };
}
export default Store;
