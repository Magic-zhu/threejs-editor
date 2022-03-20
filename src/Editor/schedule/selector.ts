import { Raycaster, Vector2 } from "three";
class Selector {
  raycaster: THREE.Raycaster = new Raycaster();
  position: THREE.Vector2 = new Vector2();
  INTERSECTED: THREE.Vector2 = new Vector2();
  camera: THREE.Camera | undefined;
  scene: THREE.Scene | undefined;
  objects:THREE.Object3D [] = [];
  // * 选取之后的回调
  callback:Function|undefined = undefined;
  /**
   * Creates an instance of Selector.
   * @param {THREE.Camera} camera
   * @param {THREE.Scene} scene
   * @param {THREE.Object3D []} objects - 需要查找的对象合集
   * @memberof Selector
   */
  constructor(camera: THREE.Camera, scene: THREE.Scene, objects: THREE.Object3D []) {
    this.camera = camera;
    this.scene = scene;
    this.objects = objects;
    this.init();
  }
  init() {
    const mousemoveHandler = (event: MouseEvent) => {
      this.position.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.position.y = -(event.clientY / window.innerHeight) * 2 + 1;
      if (!this.camera || !this.scene) {
        return;
      }
      this.raycaster.setFromCamera(this.position, this.camera);
      let intersects = this.raycaster.intersectObjects(this.objects);
      if(this.callback) this.callback(intersects);
    };
    const mousedownHandler = (event: MouseEvent) => {
      this.position.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.position.y = -(event.clientY / window.innerHeight) * 2 + 1;
      if (!this.camera || !this.scene) {
        return;
      }
      this.raycaster.setFromCamera(this.position, this.camera);
      let intersects = this.raycaster.intersectObjects(this.objects);
      if(this.callback) this.callback(intersects);
    }
    document.addEventListener("mousemove", mousemoveHandler);
    document.addEventListener("mousedown", mousedownHandler);
  }
  /**
   * 设置查询的回调函数
   * @param callback - 回调函数
   */
  setCallback(callback:Function):void {
    this.callback = callback;
  }
}
export { Selector };
