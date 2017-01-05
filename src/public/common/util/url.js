/**
 * Created by linxiaojie on 2017/1/3.
 */
import {each} from './collection.js'
import {isString} from './object.js'
/*
* 把对象转换成url参数字符串
* */
export const queryParse = (obj) => {
  var str = ''
  var u
  each(obj, function (value, key) {
    if (value !== undefined && value !== null && value !== '') {
      u = key + '=' + encodeURIComponent(value)
      str = str + (str === '' ? u : ('&' + u))
    }
  })
  return str
}
/*
* 格式化url参数字符串为对象
* */
export const formatQuery = (str) => {
  var obj = {}
  if (!str || !isString(str) || str.trim() === '') {
    return obj
  }
  var regex = /([^=]*)=(.*)$/i
  var arr = str.split('&')
  each(arr, function (value, key) {
    var m = regex.exec(value)
    if (m && m.length > 2) {
      obj[m[1]] = m[2] || ''
    }
  })
  return obj
}
/*
* 解析对象作为url的参数
* */
export const resolve = (url, obj) => {
  var qryStr = queryParse(obj)
  return ~url.indexOf('?') ? (url + '&' + qryStr) : (url + '?' + qryStr)
}
