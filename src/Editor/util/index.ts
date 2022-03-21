export const Ran32 = ():string =>{
    const MAP = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    let result = ''
    for (let i =0;i<32;i++){
        result+=Math.random()*32
    }
    return result
}