/**
 * Created by linxiaojie on 2017/1/4.
 */
import {proxy, isArrayLike} from './object.js'
const objectProto = Object.prototype
const hasOwnProperty = objectProto.hasOwnProperty
/*
 * 循环
 * */
export const each = (obj, iteratee, context) => {
  var i
  var len
  var cb = context === void 0 ? iteratee : proxy(iteratee, context)
  if (isArrayLike(obj)) {
    for (i = 0, len = obj.length; i < len; i++) {
      if (cb(obj[i], i, obj) === false) {
        break
      }
    }
  } else {
    var keys = Object.keys(obj)
    var key
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i]
      if (hasOwnProperty.call(obj, key)) {
        if (cb(obj[key], key, obj) === false) {
          break
        }
      }
    }
  }
}
