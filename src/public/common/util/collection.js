/**
 * Created by linxiaojie on 2017/1/4.
 */
import {proxy, isArrayLike, isObject, has} from './object.js'
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
  } else if (isObject(obj)) {
    var keys = Object.keys(obj)
    var key
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i]
      if (has(obj, key)) {
        if (cb(obj[key], key, obj) === false) {
          break
        }
      }
    }
  }
}

/*
随机
*/
export const shuffle = (arr) => {
  if (!isArrayLike(arr)) {
    return arr
  }
  var tempArr = arr.slice()
  var len = tempArr.length
  var i = len
  var r = 0
  var temp = 0
  for (; i > 0; i--) {
    r = Math.floor(Math.random() * i)
    temp = tempArr[r];
    tempArr[r] = tempArr[i - 1]
    tempArr[i - 1] = temp
  }
  return tempArr
}
