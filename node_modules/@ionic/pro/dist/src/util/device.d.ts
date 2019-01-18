import { App } from '../definitions';
export declare class Device {
    private app;
    deviceInfo: any;
    codeVersion: string;
    constructor(app: App);
    getInfo(): any;
    loadDeviceInfo(): Promise<{}>;
    tryGetOS(): "wp" | "android" | "ios" | "desktop";
    getBrowserInfo(): {
        browserMobileOS: string;
        browserProduct: any;
        browserAppVersion: any;
        browserUserAgent: any;
        browserPlatform: any;
        browserLanguage: any;
        browserAppName: any;
        browserAppCodeName: any;
        viewportWidth: number;
        viewportHeight: number;
        utcOffset: number;
    };
    queryDeviceInfo(): Promise<{}>;
}
