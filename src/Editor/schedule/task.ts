import {Ran32} from '../util';
export enum TaskType {
    'FILE_LOAD' = 'file_load',
    'MODEL_ADD' = 'model_add',
    'MODEL_REMOVE' = 'model_remove',
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
    // 任务内容
    content?:Function

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
                this.exit();
            }catch(err){
                this.exit(err);
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
                this.exit(err);
            }
        }
    }

    exit(err?:any){
        this.finishTime = new Date().getTime();
        if (err) {
            this.status = TaskStatus.ERROR;
        }else{
            this.status = TaskStatus.FINISHED;
        }
    }
}
export default Task