/**
 * Created by linxiaojie on 2017/1/18.
 */
import {isString, isArray} from '../util/object'
/*
* 模拟触发scrollEnd事件
* @el {window | string | nodeType}
* @return {Function} 执行取消scrollEnd事件检测
* */
export const mockScrollEnd = (selector) => {
  let el = null
  if (!selector) {
    el = window
  } else if (isString(el)) {
    el = document.querySelector(selector)
  } else if (selector.nodeType) {
    el = isArray(selector) ? selector[0] : selector
  } else {
    console.error('selector 类型不正确，请检查')
    return
  }
  let ctr = 0
  let lastCtr = 0
  let diff = 0
  let cancel = 0
  let id = null
  let scrollEnd = document.createEvent('HTMLEvents')
  scrollEnd.initEvent('scrollEnd', true, false)
  if (!window.requestAnimationFrame) {
    throw new Error('requestAnimationFrame if undefined')
  }
  const frame = () => {
    if (lastCtr !== ctr) {
      diff++
      if (diff === 5) {
        window.dispatchEvent(scrollEnd)
        ctr = lastCtr
      }
    }
    if (!cancel) {
      id = requestAnimationFrame(frame)
    }
  }
  requestAnimationFrame(frame)
  el.addEventListener('scroll', () => {
    lastCtr = ctr
    diff = 0
    ctr++
  })
  return () => {
    cancel = 1
    if (window.cancelRequestAnimationFrame) {
      window.cancelRequestAnimationFrame(id)
    }
  }
}

