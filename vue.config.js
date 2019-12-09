const path = require('path')
const { PORT, HOST } = process.env

module.exports = {
  devServer: {
    port: PORT,
    host: HOST,
    disableHostCheck: true
  },
  css: {
    extract: false
  },
  pwa: {
    workboxOptions: {
      clientsClaim: true,
      skipWaiting: true
    }
  },
  pluginOptions: {
    scaffold: {
      // 用于引入svg图标到.vue文件
      // https://github.com/nguyenvanduocit/vue-cli-plugin-style-resources-loader
      svg: {
        dir: resolve('src/assets/svg'), // 只有这个目录下的svg图片才会被转成组件
        svgo: {
          plugins: [
            { removeDoctype: true },
            { removeComments: true },
            { removeUselessStrokeAndFill: true }
          ]
        }
      }
    },
    // 用于把css预处理器的公共模块自动引入到每个文件中
    // https://github.com/nguyenvanduocit/vue-cli-plugin-style-resources-loader
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/assets/styles/config.scss'),
        path.resolve(__dirname, 'src/assets/styles/mixins.scss')
      ]
    }
  }
}

function resolve(dir) {
  return path.join(__dirname, dir)
}
