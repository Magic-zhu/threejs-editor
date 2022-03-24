import { Raycaster, Vector2, Camera, Scene, Object3D } from "three";
class Selector {
  raycaster: Raycaster = new Raycaster();
  position: Vector2 = new Vector2();
  INTERSECTED: Vector2 = new Vector2();
  container: Element
  camera: Camera | undefined;
  scene: Scene | undefined;
  objects: Object3D [] = [];
  // * 选取之后的回调
  mouseMoveCallback:Function|undefined = undefined;
  clickCallback:Function|undefined = undefined;
  /**
   * Creates an instance of Selector.
   * @param {Element} container
   * @param {THREE.Camera} camera
   * @param {THREE.Scene} scene
   * @param {THREE.Object3D []} objects - 需要查找的对象合集
   * @memberof Selector
   */
  constructor(container:Element,camera: Camera, scene: Scene, objects: Object3D []) {
    this.container = container;
    this.camera = camera;
    this.scene = scene;
    this.objects = objects;
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
    return this.raycaster.intersectObjects(this.objects,false);
  }
  clickHandler(event: MouseEvent) {
    if(this.clickCallback) {
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
    document.addEventListener("mousemove", (event)=>{this.mousemoveHandler(event)});
    document.addEventListener("click", (event)=>{this.clickHandler(event)});
  }
  destroy() {

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
