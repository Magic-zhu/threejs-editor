declare class Cache {
    pluginName: string;
    installed: boolean;
    io: any;
    install(IO: any): void;
    setCache(): void;
    getCache(): void;
}
export default Cache;
