import { ModelType } from "./loader";
import { Object3D } from "three";
export declare enum ModelStatus {
    'READY' = 0,
    'FINISHED' = 1
}
declare class Model {
    type: ModelType | string;
    uuid: string;
    self: Object3D | null;
    origin: Object3D | null;
    path: string;
    status: ModelStatus;
    constructor(path: string, type: ModelType | string);
    /**
     * 初始化模型
     * @param path - 路径
     * @param type - 模型文件类型
     */
    init(path?: string, type?: ModelType | string): Promise<Object3D>;
}
export default Model;
