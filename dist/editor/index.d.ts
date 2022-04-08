import { Options } from './schedule/index';
export * from 'three';
interface EditorApiFile {
    load: Function;
}
interface EditorApiModel {
    add: Function;
    remove: Function;
    get: Function;
    getAll: Function;
}
interface EditorApiView {
    toX: Function;
    toY: Function;
    toZ: Function;
    changeView: Function;
}
interface EditorAPiSelect {
    setMode: Function;
}
interface EditorApiHook {
    onUpdated: Function;
}
interface EditorApiAnimation {
}
interface Plugin {
    install: Function;
    installed: boolean;
    name: string;
}
declare class Editor {
    container: Element;
    plugins: any;
    private schedule;
    file: EditorApiFile;
    model: EditorApiModel;
    view: EditorApiView;
    animation: EditorApiAnimation;
    hook: EditorApiHook;
    selector: EditorAPiSelect;
    constructor(container: Element, options?: Options);
    use(plugin: Plugin | any): void;
    destroy(): void;
    private init;
    private loadFile;
    private addModel;
    private removeModel;
    private getModel;
    private getAllModel;
    private changeView;
    private setSelectMode;
    private setUpdatedCallBack;
}
export default Editor;
