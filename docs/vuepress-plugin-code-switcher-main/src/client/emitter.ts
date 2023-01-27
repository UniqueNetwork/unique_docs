import emitter from 'tiny-emitter/instance'

export default {
  $on: (...args) => emitter.on(...args),
  $emit: (...args) => emitter.emit(...args),
}
