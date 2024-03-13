import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import packageJson from "./package.json" assert { type: "json" };
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'esm',
                sourcemap: true,
            },
        ],
        plugins: [
            // NEW
            typescript(),
            peerDepsExternal(),

            resolve(),
            commonjs(),

            // NEW
            // terser(),
        ],
    },
    {
        input: 'dist/cjs/types/src/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'esm' }],
        plugins: [dts.default()],

    },
];