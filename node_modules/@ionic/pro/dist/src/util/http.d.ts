declare const postJson: (url: string, data: any) => Promise<{}>;
declare const getJson: (url: string) => Promise<{}>;
export { getJson, postJson };
