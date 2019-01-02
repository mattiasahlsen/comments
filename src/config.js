import merge from 'webpack-merge'

const baseConf = {
  commentsLimit: 20,
  childrenLimit: 10
}

export const devConf = merge(baseConf, {
})
export const prodConf = merge(baseConf, {
})

const conf = process.env.NODE_ENV === 'production' ? prodConf : devConf
export default conf
