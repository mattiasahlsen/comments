import { debugErr } from '../debug'

// Sorry for hacky code
function idValidator(MyModel, msgFunParam) {
  const msgFun = (props) => {
    const msg = msgFunParam ? msgFunParam(props) : `${props.path} does not exist`
    debugErr(msg)
    return msg
  }
  return {
    validator: v => new Promise((resolve, reject) =>
      MyModel.findById(v, (err, entry) => resolve(!err && entry))
    ),
    message: msgFun
  }
}

export { idValidator }
