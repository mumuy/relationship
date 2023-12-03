// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>
/*~ This is the module template file for function modules.
 *~ You should rename it to index.d.ts and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */
// Note that ES6 modules cannot directly export class objects.
// This file should be imported using the CommonJS-style:
//   import x = require('[~THE MODULE~]');
//
// Alternatively, if --allowSyntheticDefaultImports or
// --esModuleInterop is turned on, this file can also be
// imported as a default import:
//   import x from '[~THE MODULE~]';
//
// Refer to the TypeScript documentation at
// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
// to understand common workarounds for this limitation of ES6 modules.
/*~ If this module is a UMD module that exposes a global variable 'myFuncLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
export as namespace relationship;
/*~ This declaration specifies that the function
 *~ is the exported object from the file
 */
export = relationship;

/*~ This example shows how to have multiple overloads for your function */
declare function relationship(name: string | relationship.Options): string[];
/*~ If you want to expose types from your module as well, you can
 *~ place them in this block. Often you will want to describe the
 *~ shape of the return type of the function; that type should
 *~ be declared in here, as this example shows.
 *~
 *~ Note that if you decide to include this namespace, the module can be
 *~ incorrectly imported as a namespace object, unless
 *~ --esModuleInterop is turned on:
 *~   import * as x from '[~THE MODULE~]'; // WRONG! DO NOT DO THIS!
 */
declare namespace relationship {
  export interface Options {
    /**
     * 目標對象：目標對象的稱謂漢字表達，稱謂間用‘的’字分隔
     */
    text?: string;
    /**
     * 相對對象：相對對象的稱謂漢字表達，稱謂間用‘的’字分隔，空表示自己
     */
    target?: string;
    /**
     * 本人性別：0表示女性,1表示男性
     */
    sex?: 0 | 1;
    /**
     * 轉換類型：'default'計算稱謂,'chain'計算關系鏈,'pair'計算關系合稱
     * @default 'default'
     */
    type?: "default" | "chain" | "pair";
    /**
     * 稱呼方式：true對方稱呼我,false我稱呼對方
     * @default false
     */
    reverse?: boolean;
    /**
     * 模式選擇：使用setMode方法定制不同地區模式，在此選擇自定義模式
     * @default 'default'
     */
    mode?: "default" | (string & {});
    /**
     * 最短關系：計算兩者之間的最短關系
     * @default false
     */
    optimal?: boolean;
  }
}
