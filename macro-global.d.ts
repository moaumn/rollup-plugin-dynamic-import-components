import {DynamicImportComponentsOption} from "./src";

declare global {
    const dynamicImportComponents: (type: keyof DynamicImportComponentsOption, ...args: string[]) => any
}