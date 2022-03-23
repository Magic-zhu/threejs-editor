import { Raycaster, Vector2, Camera, Scene, Object3D } from "three";
class Selector {
  raycaster: Raycaster = new Raycaster();
  position: Vector2 = new Vector2();
  INTERSECTED: Vector2 = new Vector2();
  camera: Camera | undefined;
  scene: Scene | undefined;
  objects: Object3D [] = [];
  // * 选取之后的回调
  mouseMoveCallback:Function|undefined = undefined;
  clickCallback:Function|undefined = undefined;
  /**
   * Creates an instance of Selector.
   * @param {THREE.Camera} camera
   * @param {THREE.Scene} scene
   * @param {THREE.Object3D []} objects - 需要查找的对象合集
   * @memberof Selector
   */
  constructor(camera: Camera, scene: Scene, objects: Object3D []) {
    this.camera = camera;
    this.scene = scene;
    this.objects = objects;
    this.init();
  }
  mouseEventPositionHandler(event: MouseEvent) {
    // 世界坐标转成屏幕坐标
    this.position.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.position.y = -(event.clientY / window.innerHeight) * 2 + 1;
    if (!this.camera || !this.scene) {
      return;
    }
    this.raycaster.setFromCamera(this.position, this.camera);
    return this.raycaster.intersectObjects(this.objects);
  }
  clickHandler(event: MouseEvent) {
    const intersects = this.mouseEventPositionHandler(event);
    if(this.clickCallback) this.clickCallback(intersects);
  }
  mousemoveHandler(event: MouseEvent) {
    const intersects = this.mouseEventPositionHandler(event);
    if(this.mouseMoveCallback) this.mouseMoveCallback(intersects);
  }
  init() {
    document.addEventListener("mousemove", (event)=>{this.mousemoveHandler(event)});
    document.addEventListener("click", (event)=>{this.clickHandler(event)});
  }
  destroy() {
    document.removeEventListener('click',this.clickHandler);
    document.removeEventListener('mousemove',this.mousemoveHandler);
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
