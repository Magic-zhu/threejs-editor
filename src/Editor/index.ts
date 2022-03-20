
import { Schedule } from './schedule/index'

class Editor {
  container: Element;
  schedule: Schedule = new Schedule();

  constructor(container: Element, options?: any) {
    this.container = container;
    this.init(container);
  }

  init(container: Element) {
    this.schedule.initEditor(container);
  }

  loadFile() {

  }

  add(){

  }

  remove(){
    
  }
}

export { Editor };
