import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
export default [
    {
        input: 'src/editor/index.ts',
        plugins: [
            resolve(),
            typescript(),
            terser(),
        ],
        output: [
            {
                file: 'dist/editor-es.min.js',
                format: 'es',
                name: 'TrEditor',
            },
            {
                file: 'dist/editor-iife.min.js',
                format: 'iife',
                name: 'TrEditor',
            },
            {
                file: 'dist/editor-umd.min.js',
                format: 'umd',
                name: 'TrEditor',
            },
        ],
    },
];
