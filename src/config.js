import merge from 'webpack-merge'

const baseConf = {
  commentsLimit: 20,
  childrenLimit: 10,
  hotLimit: 15,

  API_HOST: process.env.VUE_APP_API_HOST,
  API_PORT: parseInt(process.env.VUE_APP_API_PORT),
  API_URL: `${process.env.VUE_APP_API_PROTOCOL}://${process.env.VUE_APP_API_HOST}:${process.env.VUE_APP_API_PORT}/api`
}
console.log(baseConf.API_URL)

export const devConf = merge(baseConf, {
})
export const prodConf = merge(baseConf, {
})

const conf = process.env.NODE_ENV === 'production' ? prodConf : devConf
export default conf
