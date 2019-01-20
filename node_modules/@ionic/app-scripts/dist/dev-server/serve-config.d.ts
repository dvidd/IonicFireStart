export interface ServeConfig {
    httpPort: number;
    host: string;
    hostBaseUrl: string;
    rootDir: string;
    wwwDir: string;
    buildDir: string;
    isCordovaServe: boolean;
    launchBrowser: boolean;
    launchLab: boolean;
    browserToLaunch: string;
    useLiveReload: boolean;
    liveReloadPort: Number;
    notificationPort: Number;
    useServerLogs: boolean;
    notifyOnConsoleLog: boolean;
    useProxy: boolean;
    devapp: boolean;
}
export declare const LOGGER_DIR = "__ion-dev-server";
export declare const IONIC_LAB_URL = "/ionic-lab";
export declare const IOS_PLATFORM_PATH: string;
export declare const ANDROID_PLATFORM_PATH: string;
