import * as db from "localforage";
// FIXME 应该以npm形式引入
class Cache {
    pluginName:string = 'cache'
    installed:boolean = false
    io:any
    install(IO:any){
        this.io = IO;
        IO.on('model_load',()=>{
            console.log('监听到model_load事件')
        })
    }

    setCache() {

    }

    getCache() {

    }
}

export default Cache