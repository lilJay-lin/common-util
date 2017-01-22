/**
 * Created by linxiaojie on 2017/1/18.
 */
import {isString, isArray} from '../util/object'
/*
* 模拟触发scrollEnd事件
* @param{window | string | nodeType}el
* @param{boolean} mobile: 是否使用手机模式（检查touchmove）
* @param{number} radio: 判断scollend的帧数
* @return {Function} 执行取消scrollEnd事件检测
* */
export const mockScrollEnd = ({selector, mobile = false, radio = 20}) => {
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
  const SCROLL = mobile ? 'touchmove' : 'scroll'
  let scrollEnd = document.createEvent('HTMLEvents')
  scrollEnd.initEvent('scrollEnd', true, false)
  if (!window.requestAnimationFrame) {
    throw new Error('requestAnimationFrame if undefined')
  }
  const frame = () => {
    if (lastCtr !== ctr) {
      diff++
      if (diff === radio) {
        window.dispatchEvent(scrollEnd)
        ctr = lastCtr
      }
    }
    if (!cancel) {
      id = requestAnimationFrame(frame)
    }
  }
  const scroll = () => {
    lastCtr = ctr
    diff = 0
    ctr++
  }
  requestAnimationFrame(frame)
  el.addEventListener(SCROLL, scroll, false)
  return () => {
    el.removeEventListener(SCROLL, scroll, false)
    cancel = 1
    if (window.cancelRequestAnimationFrame) {
      window.cancelRequestAnimationFrame(id)
    }
  }
}

