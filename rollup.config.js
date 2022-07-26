/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const alias = require('@rollup/plugin-alias')
const commonjs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const json = require('@rollup/plugin-json')
const replace = require('@rollup/plugin-replace')
const typescript = require('@rollup/plugin-typescript')

const pkg = require('./package.json')

const inputPath = path.resolve('./src/index.ts')
const outputUmdPath = path.resolve('./dist/', pkg.main)
const outputEsPath = path.resolve('./dist/', pkg.module)
const tsconfigPath = path.resolve('./tsconfig.json')

const extensions = ['.js', '.ts', '.mjs', '.json']

module.exports = {
  input: inputPath,
  output: [
    {
      file: outputUmdPath,
      format: 'umd',
      name: pkg.name,
    },
    {
      file: outputEsPath,
      format: 'esm',
      name: pkg.name,
    },
  ],
  plugins: [
    typescript({ tsconfig: tsconfigPath }),
    // json 转换 esm
    json({
      indent: '  ', // 缩进
      compact: true, // 忽略 indent 并生成最小的代码
      preferConst: true, // 将属性声明为变量
    }),
    commonjs(), // commonjs 转换 esm
    // node_modules 定位
    nodeResolve({
      browser: true,
      mainFields: ['module', 'main'], // 解析的入口点
      extensions, // 指定插件将操作的文件的扩展名
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }), // 文本替换
    alias({ entries: [{ find: '@', replacement: path.resolve('./src') }] }),
  ],
}
