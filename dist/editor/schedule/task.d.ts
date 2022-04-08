export declare enum TaskType {
    'FILE_LOAD' = "file_load",
    'MODEL_ADD' = "model_add",
    'MODEL_REMOVE' = "model_remove",
    'VIEW_CHANGE' = "view_change",
    'SELECTOR_MODE_CHANGE' = "selector_mode_change",
    'MODEL_GET' = "model_get"
}
export declare enum TaskStatus {
    'READY' = "ready",
    'RUNNING' = "running",
    'FINISHED' = "finished",
    'WAITING' = "waiting",
    'ERROR' = "error"
}
declare class Task {
    pid: string;
    beginTime?: number;
    finishTime?: number;
    launchTime: number;
    payload: any;
    type?: TaskType;
    status: TaskStatus;
    keepAlive: boolean;
    content?: Function;
    /**
     *
     * @param {TaskType} type - 任务类型
     * @param {Function} content - 任务内容
     * @param {} payload - 任务携带的数据
     */
    constructor(type: TaskType, content: Function, payload?: any);
    do(): Promise<void>;
    doSync(): void;
    /**
     *
     * @description 任务退出
     * @param {number} [async=0] - 是否异步任务
     * @param {*} [err] - 错误信息
     * @memberof Task
     */
    exit(async?: number, err?: any): void;
}
export default Task;
