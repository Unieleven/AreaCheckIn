const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '',
  devServer: {
    // https:true,
    client: {
      overlay: false
    },
    proxy: {
      '/events': {
        target: 'https://uat.issmart.com.cn/ebg3/isdm_admin_module/',
        changeOrigin: true,
        // pathRewrite: {
        //   '/events': ''
        // }
      },
      '/checkIns': {
        target: 'https://uat.issmart.com.cn/ebg3/isdm_admin_module/',
        changeOrigin: true,
      },

    }
  },
})
