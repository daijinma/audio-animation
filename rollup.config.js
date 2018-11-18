import json from 'rollup-plugin-json';
// import { version } from "./package.json";
import path from "path"
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

const resolveFile = function(filePath) {
  return path.join(__dirname, filePath)
}
export default {
    input: resolveFile('./src/index.js'),
    output: {
      file: resolveFile("./dist/bundle.js"),
      format: 'umd',
      sourcemap:true,
      name:"AudioMap",
    },
    // banner: '/* my-library version ' + version + ' */',
    plugins: [
      json(),
      // 使用和配置babel编译插件
      babel({
        "presets": [
          ["@babel/preset-env"],
        ],
        "plugins": [
          "transform-object-rest-spread",
          "@babel/plugin-proposal-class-properties"
        ],
      }),
      // 使用开发服务插件
      serve({
        port: 3001,
        // 设置 exmaple的访问目录和dist的访问目录
        contentBase: [resolveFile('./'), resolveFile('dist')]
      })
    ]
  };
  