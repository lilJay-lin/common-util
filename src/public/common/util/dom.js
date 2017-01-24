/**
 * Created by linxiaojie on 2017/1/22.
 */
import {each} from '../util/collection'
import {isArrayLike, isString, isArray} from '../util/object'
const ClassesSplit = /(\S+)(?:\s+)?/gi

const classOperation = (oper) => {
  return function (el, classes) {
    if (classes === void 0) {
      return this
    }
    if (el.nodeType !== 1) {
      console.error('el 参数必须是dom节点')
      return
    }
    let res
    let v = null
    if (isArray(classes)) {
      each(classes, (cls) => {
        res = el.classList[oper](cls)
      })
    } else {
      classes = String(classes)
      while ((v = ClassesSplit.exec(classes)) !== null) {
        res = el.classList[oper](v[1])
      }
    }
    return res === undefined ? this : res
  }
}

const classOperationDone = (classOperation) => {
  return (els, classes) => {
    if (arguments.length < 2) {
      console.error('参数个数不能少于2个')
      return
    }
    els = isArrayLike(els) ? els : [els]
    let res
    each(els, (el) => {
      res = classOperation(el, classes)
    })
    return res === undefined ? this : res
  }
}
/*
* 节点样式class增删改
* */
export const addClass = classOperationDone(classOperation('add'))
export const removeClass = classOperationDone(classOperation('remove'))
export const toggleClass = classOperationDone(classOperation('toggle'))
export const hasClass = classOperationDone(classOperation('contains'))

/*
* 兼容的样式前缀
* */
const cssPrefixes = ['Webkit', 'moz', 'o', 'ms']

/*
* 获取节点当前有效样式集合
* */
const cssStyle = (el) => {
  if (window.getComputedStyle) {
    return el.ownerDocument.defaultView.getComputedStyle(el, null)
  } else {
    return el.currentStyle
  }
}
/*
* 获取有效的属性写法
* */
export const cssProperty = (prop, style) => {
  if (style[prop] !== undefined) {
    return prop
  }
  let className = prop.substr(0, 1).toUpperCase() + prop.substr(1)
  let original = prop
  each(cssPrefixes, (prefix) => {
    prop = prefix + className
    if (style[prop] !== undefined) {
      original = prop
    }
  })
  return original
}
/*
* 在节点上设置指定样式获取读取样式值
* @param{element} el: dom节点
* @param{Object|String} props: 字符串返回当前节点指定样式值，Object在当前节点上设置样式
* */
export const css = (el, props) => {
  if (el && el.nodeType !== 1) {
    console.error('el 参数必须是dom节点')
    return
  }
  if (arguments.length < 2) {
    console.error('参数个数不能少于2个')
    return
  }
  let style = el.style
  if (isString(props)) {
    return cssStyle(el)[props]
  } else {
    each(props, (value, prop) => {
      prop = cssProperty(prop, style)
      style[prop] = value
    })
  }
  return this
}
