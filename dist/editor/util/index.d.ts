import { Object3D } from "three";
export declare const Ran32: () => string;
export declare const findIndex: (target: any, targetGroup: any[], key: any) => number;
export declare const findUntilParentScene: (target: Object3D) => Object3D | undefined;
export declare const throttle: (func: Function, wait: number) => (...args: any) => void;
export declare const chalk: (css: any, string: string, data?: string) => void;
