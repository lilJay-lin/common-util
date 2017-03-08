/**
 * Created by linxiaojie on 2017/3/7.
 */
import {isFunction} from '../util/object'
import {each} from '../util/collection'
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class Promise {
  constructor (resolver) {
    if (!isFunction(resolver)) {
      console.error('参数类型必须是函数')
      return
    }
    if (!(this instanceof Promise)) {
      return new Promise(resolver)
    }
    let me = this
    me._state = PENDING
    me._done = []
    me._fail = []
    me._value = null
    me._reason = null
    resolver(me.resolve.bind(this), me.reject.bind(this))
  }
  resolve (value) {
    let me = this
    let done = null
    if (me._state !== PENDING) {
      return
    }
    me._state = FULFILLED
    me._value = value
    while ((done = me._done.shift())) {
      /*
      eslint-disable no-useless-call
      */
      me._value = done.apply(null, [value])
    }
  }
  reject (reason) {
    let me = this
    let fail = null
    if (me._state !== PENDING) {
      return
    }
    me._state = REJECTED
    me._reason = reason
    while ((fail = me._fail.shift())) {
      /*
      eslint-disable no-useless-call
      */
      me._reason = fail.apply(null, [reason])
    }
  }
  then (done, fail) {
    let promise = this
    return new Promise((resolve, reject) => {
      function callback (value) {
        let rel = isFunction(done) ? done(value) : done
        if (Promise.isThenable(rel)) {
          rel.then((value) => {
            resolve(value)
          }, (reason) => {
            reject(reason)
          })
        } else {
          resolve(rel)
        }
      }
      function errCallback (reason) {
        let rel = isFunction(fail) ? fail(reason) : reason
        if (Promise.isThenable(rel)) {
          rel.then((value) => {
            resolve(value)
          }, (reason) => {
            reject(reason)
          })
        } else {
          reject(rel)
        }
      }
      var state = promise._state
      if (state === PENDING) {
        promise._done.push(callback)
        promise._fail.push(errCallback)
      } else if (state === FULFILLED) {
        callback(promise._value)
      } else if (state === REJECTED) {
        errCallback(promise._reason)
      }
    })
  }
}
Promise.isThenable = (obj) => {
  return obj && isFunction(obj.then)
}

Promise.resolve = (value) => {
  if (value instanceof Promise) {
    return value
  }
  return new Promise((resolve, reject) => {
    resolve(value)
  })
}

Promise.reject = (value) => {
  if (value instanceof Promise) {
    return value
  }
  return new Promise((resolve, reject) => {
    reject(value)
  })
}

Promise.all = (args) => {
  let promises = [].slice.call(args)
  let remaining = promises.length
  let res = []
  let pending = true
  return new Promise((resolve, reject) => {
    each(promises, (p) => {
      Promise.resolve(p).then((value) => {
        res.push(value)
        remaining = remaining - 1
        if (remaining === 0) {
          resolve(res)
        }
      }, (value) => {
        pending && reject(value)
        pending = false
      })
      return pending
    })
  })
}

Promise.race = (args) => {
  let promises = [].slice.call(args)
  let pending = true
  return new Promise((resolve, reject) => {
    each(promises, (p) => {
      if (pending === false) {
        return
      }
      Promise.resolve(p).then((value) => {
        pending && resolve(value)
        pending = false
      }, (value) => {
        pending && reject(value)
        pending = false
      })
      return pending
    })
  })
}
export default Promise
