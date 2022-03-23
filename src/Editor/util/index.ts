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