const path = require('path')

module.exports = {
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/styles/imports.scss'),
      ]
    }
  },

  devServer: {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    https: process.env.SERVER_PROTOCOL === 'https'
  },
  productionSourceMap: false
}

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/styles/imports.scss'),
        path.resolve(__dirname, './src/styles/main.scss'),
        path.resolve(__dirname, './src/styles/queries.scss'),
      ],
    })
}
