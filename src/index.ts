import {getTransformResult, parseAst, transformAst} from "./transform";
import {REGEX_SETUP_SFC, REGEX_TS_FILE, REGEX_VUE_SFC} from "./common";
import {createFilter} from '@rollup/pluginutils';
import {MagicString} from 'magic-string-ast';
import {parse as parseSFC} from '@vue/compiler-sfc';

export default function CreateDynamicImportComponentPlugin(option: Record<string, (...args: string[]) => string>) {
    const filter = createFilter([REGEX_TS_FILE, REGEX_SETUP_SFC, REGEX_VUE_SFC]);
    return {
        name: 'sort-dynamic-import',
        enforce: 'pre',
        transform(code: string, id: string) {
            if (!filter(id)) return;
            if (!code.includes('dynamicImportComponent')) return;

            const s = new MagicString(code);
            if (REGEX_VUE_SFC.test(id)) {
                console.log(id);
                const {descriptor} = parseSFC(code, {filename: id});
                if (descriptor.scriptSetup) {
                    const setUpAst = parseAst(descriptor.scriptSetup.content, descriptor.scriptSetup.lang);
                    transformAst(setUpAst, s, option, descriptor.scriptSetup.loc.start.offset);
                }
                if (descriptor.script) {
                    const scriptAst = parseAst(descriptor.script.content, descriptor.script.lang);
                    transformAst(scriptAst, s, option, descriptor.script.loc.start.offset);
                }
            } else {
                let lang = /\.tsx?$/.test(id) ? 'ts' : 'js';
                if (id.endsWith('x')) {
                    lang += 'x';
                }
                const ast = parseAst(code, lang);
                transformAst(ast, s, option);
            }
            return getTransformResult(s, id);
        },
    };
}