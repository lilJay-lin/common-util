/**
 * Created by linxiaojie on 2017/1/4.
 */
/*
 * 本地方法映射
 * */
const objectProto = Object.prototype
const toString = objectProto.toString

/*
 * 常量定义
 * */
const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1

/*
 * 返回获取指定属性的快捷方法
 * */
export const property = (key) => {
  return function (obj) {
    return obj == null ? obj : obj[key]
  }
}

/*
 * 是否类似数组
 * */
const getLength = property('length')
export const isArrayLike = (obj) => {
  var length = getLength(obj)
  return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX
}

/*
 * 判断对象类型
 * */
function isType (str) {
  return (obj) => {
    return toString.call(obj) === '[object ' + str + ']'
  }
}
export const isObject = isType('Object')
export const isFunction = isType('Function')
export const isArray = isType('Array')
export const isString = isType('String')

/*
 * 函数代理
 * */
export const proxy = (fn, context) => {
  return function () {
    let cxt = this
    if (context) {
      cxt = context
    }
    return fn.apply(cxt, arguments)
  }
}
