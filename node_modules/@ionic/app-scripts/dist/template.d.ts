import { BuildContext, ChangedFile } from './util/interfaces';
export declare function templateUpdate(changedFiles: ChangedFile[], context: BuildContext): Promise<void>;
export declare function inlineTemplate(sourceText: string, sourcePath: string): string;
export declare function updateTemplate(componentDir: string, match: TemplateUrlMatch): string;
export declare function replaceTemplateUrl(match: TemplateUrlMatch, htmlFilePath: string, templateContent: string): string;
export declare function replaceExistingJsTemplate(existingSourceText: string, newTemplateContent: string, htmlFilePath: string): string;
export declare function getTemplateFormat(htmlFilePath: string, content: string): string;
export declare function getTemplateMatch(str: string): TemplateUrlMatch;
export interface TemplateUrlMatch {
    start: number;
    end: number;
    component: string;
    templateProperty: string;
    templateUrl: string;
}
