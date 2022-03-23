import Schedule from './schedule/index'
import {ModelType} from "./schedule/loader";
import Model from "./schedule/model";
import {Object3D} from "three";
interface EditorApiFile {
    load:Function,
    add?:Function,
    remove?:Function,
}
interface EditorApiModel {
    add:Function,
    remove:Function,
}
class Editor {
    container: Element;
    schedule: Schedule = new Schedule();

    file: EditorApiFile = {
        load: this.loadFile.bind(this),
    }

    model:EditorApiModel = {
        add: this.addModel.bind(this),
        remove: this.removeModel.bind(this),
    }

    constructor(container: Element, options?: any) {
        this.container = container;
        this.init(container);
    }

    private init(container: Element) {
        this.schedule.initEditor(container);
    }

    private async loadFile(path: string, type: ModelType | string):Promise<Model> {
        return await this.schedule.file_load(path, type);
    }

    private addModel(obj:Object3D) {
        this.schedule.model_add(obj)
    }

    private removeModel(obj:Object3D) {
        this.schedule.model_remove(obj)
    }
}
export default Editor
