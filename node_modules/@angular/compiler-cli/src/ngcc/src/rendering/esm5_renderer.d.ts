/// <amd-module name="@angular/compiler-cli/src/ngcc/src/rendering/esm5_renderer" />
import MagicString from 'magic-string';
import { NgccReflectionHost } from '../host/ngcc_host';
import { CompiledClass } from '../analysis/decoration_analyzer';
import { BundleInfo } from '../packages/bundle';
import { EsmRenderer } from './esm_renderer';
export declare class Esm5Renderer extends EsmRenderer {
    protected host: NgccReflectionHost;
    protected bundle: BundleInfo;
    protected sourcePath: string;
    protected targetPath: string;
    constructor(host: NgccReflectionHost, bundle: BundleInfo, sourcePath: string, targetPath: string, transformDts: boolean);
    /**
     * Add the definitions to each decorated class
     */
    addDefinitions(output: MagicString, compiledClass: CompiledClass, definitions: string): void;
}
