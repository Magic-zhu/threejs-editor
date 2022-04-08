import { Raycaster, Vector2, Camera, Scene, Object3D } from "three";
import Store from "../data";
declare class Selector {
    raycaster: Raycaster;
    position: Vector2;
    container: Element;
    camera: Camera | undefined;
    scene: Scene | undefined;
    data: Store;
    mouseMoveCallback: Function | undefined;
    clickCallback: Function | undefined;
    mousemoveListener: any;
    clickListener: any;
    /**
     * Creates an instance of Selector.
     * @param {Element} container
     * @param {Camera} camera
     * @param {Scene} scene
     * @param {Store} data
     * @memberof Selector
     */
    constructor(container: Element, camera: Camera, scene: Scene, data: Store);
    mouseEventPositionHandler(event: MouseEvent): import("three").Intersection<Object3D<import("three").Event>>[] | undefined;
    clickHandler(event: MouseEvent): void;
    mousemoveHandler(event: MouseEvent): void;
    init(): void;
    destroy(): void;
    /**
     * 设置查询的回调函数
     * @param type - 事件类型
     * @param callback - 回调函数
     */
    setCallback(type: string, callback: Function): this;
}
export default Selector;
