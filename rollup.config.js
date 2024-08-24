import fs from 'node:fs';
import path from 'node:path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';
import dts from 'unplugin-isolated-decl/rollup';
import esbuild from 'rollup-plugin-esbuild';

/**
 * @param {string} project
 * @returns {RollupOptions}
 */
function getConfig(project) {
    const inputs = [`./packages/${project}/index.ts`];
    const outDir = `./packages/${project}/dist`;

    if (project === 'two-inputs') inputs.push(`./packages/${project}/cli.ts`);

    const projectRoot = path.resolve(path.join(outDir, '..'));
    fs.rmSync(outDir, { force: true, recursive: true });

    return {
        input: inputs,
        output: {
            dir: outDir,
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            preserveShebangs(),
            dts(),
            esbuild({ tsconfig: 'tsconfig.json', sourceRoot: projectRoot }),
            nodeResolve({ preferBuiltins: true, rootDir: projectRoot }),
            commonjs(),
        ],
    };
}

export default [getConfig('one-input'), getConfig('two-inputs')];
