module.exports = {
  //路径前缀
  publicPath: "/",
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    });
    const entry = config.entry('app');
    entry.add('babel-polyfill').end();
    entry.add('classlist-polyfill').end();
    entry.add('@/mock').end();
  },
  //开发模式反向代理配置，生产模式请使用Nginx部署并配置反向代理
  devServer: {
    port: 1888,
    proxy: {
      '/': {
        //本地服务接口地址
        // target: 'http://yunapi.gzbigbang.cn/rsy',
        //远程演示服务地址,可用于直接启动项目
        target: 'http://39.105.49.12:8099',
        ws: true,
        origin: true,
        // pathRewrite: {
        //   '^/api': '/'
        // }
      }
    }
  }
};
