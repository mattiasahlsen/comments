module.exports = function(api) {
  api.cache(true)
  let plugins = []
  if (process.env.VUE_CLI_BABEL_TARGET_NODE === 'true') {
    plugins = ['@babel/plugin-transform-modules-commonjs', '@babel/plugin-syntax-dynamic-import']
  }
  return {
    presets: [
      '@vue/app'
    ],
    plugins: plugins
  }
}
