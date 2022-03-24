import Schedule, {Options} from './schedule/index'
import {ModelType} from "./schedule/loader";
import Model from "./schedule/model";
import {Object3D} from "three";

interface EditorApiFile {
    load: Function,
    add?: Function,
    remove?: Function,
}

interface EditorApiModel {
    add: Function,
    remove: Function,
}

interface EditorApiView {
    toX: Function,
    toY: Function,
    toZ: Function,
    changeView: Function,
}

class Editor {
    container: Element;
    schedule: Schedule = new Schedule();

    file: EditorApiFile = {
        load: this.loadFile.bind(this),
    }

    model: EditorApiModel = {
        add: this.addModel.bind(this),
        remove: this.removeModel.bind(this),
    }

    view: EditorApiView = {
        // @ 从x轴正向看向场景
        toX: this.changeView.bind(this, 200, 0, 0),
        // @ 从y轴正向看向场景
        toY: this.changeView.bind(this, 0, 200, 0),
        // @ 从z轴正向看向场景
        toZ: this.changeView.bind(this, 0, 0, 200),
        changeView: this.changeView.bind(this),
    }

    constructor(container: Element, options: Options = {}) {
        this.container = container;
        this.init(container, options);
    }

    private init(container: Element, options: Options) {
        this.schedule.init(container, options);
    }

    private async loadFile(path: string, type: ModelType | string): Promise<Model> {
        return await this.schedule.file_load(path, type);
    }

    private addModel(obj: Object3D) {
        this.schedule.model_add(obj)
    }

    private removeModel(obj: Object3D) {
        this.schedule.model_remove(obj)
    }

    private changeView(x: number, y: number, z: number) {
        this.schedule.view_change(x, y, z);
    }
}

export default Editor
