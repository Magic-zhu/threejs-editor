import {Ran32} from '../util';
import IO from "../io";
export enum TaskType {
    'FILE_LOAD' = 'file_load',
    'MODEL_ADD' = 'model_add',
    'MODEL_REMOVE' = 'model_remove',
    'VIEW_CHANGE' = 'view_change',
    'SELECTOR_MODE_CHANGE' = 'selector_mode_change',
    'MODEL_GET' = 'model_get',
}
export enum TaskStatus {
    // 就绪
    'READY'= 'ready',
    // 运行
    'RUNNING' = 'running',
    // 完成
    'FINISHED' = 'finished',
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
    payload:any = {};
    // 任务类型
    type?:TaskType
    // 任务状态
    status:TaskStatus = TaskStatus.READY
    // 保持任务不被销毁
    keepAlive:boolean = false
    // 任务内容
    content?:Function

    /**
     *
     * @param {TaskType} type - 任务类型
     * @param {Function} content - 任务内容
     * @param {} payload - 任务携带的数据
     */
    constructor(type:TaskType,content:Function,payload:any = {}) {
        this.type = type;
        this.content = content;
        this.payload = payload;
    }

    async do() {
        this.beginTime = new Date().getTime();
        this.status = TaskStatus.RUNNING;
        if(this.content){
            try {
                this.payload.result = await this.content();
                this.exit(1);
            }catch(err){
                this.exit(1,err);
            }
        }
    }

    doSync() {
        this.beginTime = new Date().getTime();
        this.status = TaskStatus.RUNNING;
        if(this.content){
            try {
                this.payload.result = this.content();
                this.exit();
            }catch(err){
                this.exit(0,err);
            }
        }
    }

    /**
     *
     * @description 任务退出
     * @param {number} [async=0] - 是否异步任务
     * @param {*} [err] - 错误信息
     * @memberof Task
     */
    exit(async:number = 0, err?:any){
        this.finishTime = new Date().getTime();
        if (err) {
            this.status = TaskStatus.ERROR;
            this.payload.error = err;
        }else{
            this.status = TaskStatus.FINISHED;
        }
        // @ 触发退出事件
        if(async===1){
            IO.emit('task_exit',this.pid);
        }
    }
}
export default Task