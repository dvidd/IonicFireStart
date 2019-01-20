export interface IonicProject {
    name: string;
    email: string;
    app_id: string;
    proxies: {
        path: string;
        proxyUrl: string;
        proxyNoAgent: boolean;
        rejectUnauthorized: boolean;
        cookieRewrite: string | boolean;
    }[];
}
export declare function getProjectJson(): Promise<IonicProject>;
