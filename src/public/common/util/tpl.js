/**
 * Created by linxiaojie on 2017/1/4.
 */
import {isArrayLike, isObject} from './object.js'
import {each} from './collection.js'
/* eslint-disable no-useless-escape */
const tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g
/*
 * 渲染，
 * param{html string} template,
 * param{obj} context
 * 根据传入String做变量替换，返回替换之后的字符串
 */
export const render = (template, context) => {
  return template.replace(tokenReg, function (word, slash1, token, slash2) {
    if (slash1 || slash2) {
      return word.replace('\\', '')
    }
    var variables = token.replace(/\s/g, '').split('.')
    var currentObject = context
    var i = 0
    var length = variables.length
    var variable
    for (; i < length; i++) {
      variable = variables[i]
      currentObject = currentObject[variable]
      if (currentObject === undefined || currentObject === null) {
        return ''
      }
    }
    return currentObject
  })
}

/*
不处理多重内嵌的数组，只处理一元数组
*/
export const renderArray = (template, arr) => {
  if (arr == null || !isArrayLike(arr)) {
    return template
  }
  var html = ''
  var obj = {}
  each(arr, function (val, i) {
    if (isObject(arr[i])) {
      obj = arr[i]
      obj._order = i + 1
    } else {
      obj.value = arr[i]
      obj._order = i + 1
    }
    html += render(template, obj)
  })
  return html
}
