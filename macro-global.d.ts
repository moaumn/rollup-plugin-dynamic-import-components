import {DynamicImportComponentOption} from "./src";

declare global {
    const dynamicImportComponent: (type: keyof DynamicImportComponentOption, ...args: string[]) => any
}