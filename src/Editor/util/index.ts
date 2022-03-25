import {Object3D} from "three";

export const Ran32 = (): string => {
    const MAP = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    let result = ''
    for (let i = 0; i < 32; i++) {
        result += MAP[Math.floor(Math.random() * 32)]
    }
    return result
}

export const findIndex = (target: any, targetGroup: any [], key: any): number => {
    const len = targetGroup.length;
    for (let i = 0; i < len; i++) {
        if (target[key] === targetGroup[i][key]) {
            return i
        }
    }
    return -1
}

export  const  findUntilParentScene = (target:Object3D):Object3D|undefined => {
    let r:Object3D|undefined
    function find(t:Object3D) {
        if(t.parent && t.parent.type!=='Scene'){
            find(t.parent)
        }else{
            r = t
        }
    }
    find(target)
    return r
}

export const throttle = (func:Function,wait:number) => {
    let timer:number|null = null
    return function (args:any) {
        if(timer){
            clearTimeout(timer)
        }
        console.log('出发了节流')
        timer = setTimeout(()=>{
            func(...args);
        },wait)
    }
}