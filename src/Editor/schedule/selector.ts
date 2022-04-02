import { Raycaster, Vector2, Camera, Scene, Object3D } from "three";
import Store, {SelectMode} from "../data";
class Selector {
  raycaster: Raycaster = new Raycaster();
  position: Vector2 = new Vector2();
  container: Element
  camera: Camera | undefined;
  scene: Scene | undefined;
  data: Store;
  // * 选取之后的回调
  mouseMoveCallback:Function|undefined = undefined;
  clickCallback:Function|undefined = undefined;
  // * listener
  mousemoveListener:any = undefined;
  clickListener:any = undefined;
  /**
   * Creates an instance of Selector.
   * @param {Element} container
   * @param {Camera} camera
   * @param {Scene} scene
   * @param {Store} data
   * @memberof Selector
   */
  constructor(container:Element,camera: Camera, scene: Scene, data: Store,) {
    this.container = container;
    this.camera = camera;
    this.scene = scene;
    this.data = data;
    this.init();
  }
  mouseEventPositionHandler(event: MouseEvent) {
    // 世界坐标转成屏幕坐标
    // @ts-ignore
    this.position.x = ((event.clientX-this.container.offsetLeft) / this.container.clientWidth) * 2 - 1;
    // @ts-ignore
    this.position.y = -((event.clientY-this.container.offsetTop) / this.container.clientHeight) * 2 + 1;
    if (!this.camera || !this.scene) {
      return;
    }
    this.raycaster.setFromCamera(this.position, this.camera);
    const recursive = this.data.selectMode !== SelectMode.SIMPLE;
    return this.raycaster.intersectObjects(this.data.modelGroup,recursive);
  }
  clickHandler(event: MouseEvent) {
    if(this.clickCallback && this.data.selectMode!==SelectMode.NONE) {
      const intersects = this.mouseEventPositionHandler(event);
      if(this.clickCallback) this.clickCallback(intersects);
    }
  }
  mousemoveHandler(event: MouseEvent) {
    if(this.mouseMoveCallback){
      const intersects = this.mouseEventPositionHandler(event);
      this.mouseMoveCallback(intersects);
    }
  }
  init() {
    this.mousemoveListener = (event:MouseEvent)=>{this.mousemoveHandler(event)};
    this.clickListener = (event:MouseEvent)=>{this.clickHandler(event)};
    document.addEventListener("mousemove", this.mousemoveListener);
    document.addEventListener("click", this.clickListener);
  }
  destroy() {
    document.removeEventListener("mousemove", this.mousemoveListener);
    document.removeEventListener("click", this.clickListener);
  }
  /**
   * 设置查询的回调函数
   * @param type - 事件类型
   * @param callback - 回调函数
   */
  setCallback(type:string,callback:Function):this {
    switch (type) {
      case 'click':
        this.clickCallback = callback;
        break
      case 'mousemove':
        this.mouseMoveCallback = callback;
        break
    }
    return this
  }
}
export default Selector;
