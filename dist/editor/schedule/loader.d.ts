import Model from "./model";
export declare enum ModelType {
    'stl' = "stl",
    'obj' = "obj",
    'mtl' = "mtl",
    'fbx' = "fbx",
    'collada' = "collada",
    'ply' = "ply",
    'gltf' = "gltf",
    'vtk' = "vtk"
}
export declare const loaderMap: any;
declare class Loader {
    load(path: string, type: ModelType | string): Promise<Model>;
}
export default Loader;
