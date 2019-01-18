/// <amd-module name="@angular/compiler-cli/src/ngcc/src/rendering/esm_renderer" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
import MagicString from 'magic-string';
import { NgccReflectionHost, SwitchableVariableDeclaration } from '../host/ngcc_host';
import { CompiledClass } from '../analysis/decoration_analyzer';
import { BundleInfo } from '../packages/bundle';
import { Renderer } from './renderer';
export declare class EsmRenderer extends Renderer {
    protected host: NgccReflectionHost;
    protected bundle: BundleInfo;
    protected sourcePath: string;
    protected targetPath: string;
    constructor(host: NgccReflectionHost, bundle: BundleInfo, sourcePath: string, targetPath: string, transformDts: boolean);
    /**
     *  Add the imports at the top of the file
     */
    addImports(output: MagicString, imports: {
        name: string;
        as: string;
    }[]): void;
    addConstants(output: MagicString, constants: string, file: ts.SourceFile): void;
    /**
     * Add the definitions to each decorated class
     */
    addDefinitions(output: MagicString, compiledClass: CompiledClass, definitions: string): void;
    /**
     * Remove static decorator properties from classes
     */
    removeDecorators(output: MagicString, decoratorsToRemove: Map<ts.Node, ts.Node[]>): void;
    rewriteSwitchableDeclarations(outputText: MagicString, sourceFile: ts.SourceFile, declarations: SwitchableVariableDeclaration[]): void;
}
