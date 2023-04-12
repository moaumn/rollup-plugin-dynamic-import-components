import {describe, it, expect} from "vitest";
import {rollup, Plugin} from "rollup";
import CreateDynamicImportComponentsPlugin from "../src";
import glob from 'fast-glob';

export const RollupToStringPlugin = (): Plugin => {
    return {
        name: 'to-string',
        transform: (code) => `export default \`${code.replace(/`/g, '\\`')}\``,
    }
}
describe('fixtures', () => {
    it('fixtures', async () => {
        const bundle = await rollup({
            input: await glob('tests/fixtures/*.{vue,js,ts}'),
            plugins: [
                CreateDynamicImportComponentsPlugin({
                    'com': (name: string) => {
                        return `() => import('/tests/fixtures/${name}.vue')`;
                    }
                }),
                RollupToStringPlugin(),
            ],
            treeshake: false,
        });
        const output = await bundle.generate({
            format: 'esm',
            sourcemap: false,
        });
        const code = output.output.map(file => file.type === 'chunk' ? file.code : file.fileName).join('\n')
        expect(code).toMatchSnapshot();
    });
});