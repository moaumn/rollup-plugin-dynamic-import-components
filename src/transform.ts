import type {CallExpression, Node} from '@babel/types';
import {MagicStringBase, MagicString} from 'magic-string-ast';
import {parse, type ParserPlugin} from '@babel/parser';
import {walkAST} from 'ast-walker-scope';
export function isCallOf(
    node: Node | null | undefined,
    test: string | string[] | ((id: string) => boolean)
): node is CallExpression {
    return !!(
        node &&
        node.type === 'CallExpression' &&
        node.callee.type === 'Identifier' &&
        (typeof test === 'string'
            ? node.callee.name === test
            : Array.isArray(test)
                ? test.includes(node.callee.name)
                : test(node.callee.name))
    );
}

export function getTransformResult(s: MagicStringBase | undefined, id: string): {code: string; map: any} | undefined {
    if (s?.hasChanged()) {
        return {
            code: s.toString(),
            get map() {
                return s.generateMap({
                    source: id,
                    includeContent: true,
                    hires: true,
                });
            },
        };
    }
}

export function parseAst(code: string, lang: string = '') {
    const plugins: ParserPlugin[] = [];
    if (/tsx?$/.test(lang)) {
        plugins.push('typescript');
    }
    if (lang.endsWith('x')) {
        plugins.push('jsx');
    }
    return parse(code, {
        sourceType: 'module',
        plugins,
    });
}

export function transformAst(
    ast: Node | Node[],
    s: MagicString,
    option: Record<string, (...args: string[]) => string>,
    offset: number = 0
) {
    walkAST(ast, {
        enter(node) {
            if (isCallOf(node, 'dynamicImport')) {
                const [type, ...args] = node.arguments.map(node => node.value);
                if (Reflect.has(option, type)) {
                    s.overwriteNode(node, option[type](...args), {offset});
                }
            }
        },
    });
}