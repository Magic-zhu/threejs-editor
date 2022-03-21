import {Ran32} from '../util';
export enum TaskType {
    ''
}
export enum TaskStatus {
    // 就绪
    'READY'= 'ready',
    // 运行
    'RUNNING' = 'running',
    // 阻塞
    'WAITING' = 'waiting',
    // 出错
    'ERROR' = 'error',
}

class Task{
    // 任务id
    pid:string = Ran32();
    // 任务开始时间
    beginTime?: number;
    // 任务结束时间
    finishTime?: number;
    // 任务发起时间
    launchTime: number = new Date().getTime();
    // 负载数据
    payload:any;
    // 任务类型
    type?:TaskType
    // 任务状态
    status:TaskStatus = TaskStatus.READY

    constructor() {
    }

    exit(){

    }
}
export default Task