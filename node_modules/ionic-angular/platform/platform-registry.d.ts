import { InjectionToken } from '@angular/core';
import { PlatformConfig } from './platform';
export declare const PLATFORM_CONFIGS: {
    [key: string]: PlatformConfig;
};
export declare const PlatformConfigToken: InjectionToken<any>;
export declare function providePlatformConfigs(): {
    [key: string]: PlatformConfig;
};
