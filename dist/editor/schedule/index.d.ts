import { Color, Object3D } from "three";
import Loader, { ModelType } from "./loader";
import Store, { SelectMode } from "../data/";
import Task from "./task";
import IO from "../io/index";
export interface Options {
    backgroundColor?: Color;
    backgroundAlpha?: number;
    fps?: boolean;
    statsMode?: number;
    dataChange?: boolean;
    roomEnvironment?: boolean;
    cameraFov?: number;
    cameraAspect?: number;
    cameraNear?: number;
    cameraFar?: number;
    enableLinearOutPutEncode?: boolean;
}
declare class Schedule {
    _data: Store;
    data: Store;
    file: Loader;
    taskQueue: Task[];
    INTERSECTED: any;
    io: typeof IO;
    onUpdate: Function;
    init(container: Element, options?: Options): void;
    destroy(): void;
    file_load(path: string, type: ModelType | string): Promise<any>;
    model_add(obj: Object3D): void;
    model_remove(obj: Object3D): void;
    model_get(id: string): void;
    model_get_all(): void;
    view_change(x: number, y: number, z: number): void;
    selector_mode_set(mode: SelectMode): void;
}
export default Schedule;
