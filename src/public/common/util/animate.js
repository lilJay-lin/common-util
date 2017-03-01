/**
 * Created by linxiaojie on 2017/1/9.
 */
import {isString} from './object.js'
import {css} from './dom'
const transEndEventNames = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd otransitionend',
  msTransition: 'MSAnimationEnd',
  transition: 'transitionend'
}

const animateEndEventNames = {
  WebkitAnimation: 'webkitAnimationEnd',
  OAnimation: 'oAnimationEnd',
  msAnimation: 'MSAnimationEnd',
  MozAnimation: 'animationend',
  animation: 'animationend'
}

const getPrefix = (type) => {
  const b = document.body || document.documentElement
  const s = b.style
  let p = type || 'animation'
  let i = 0
  const v = ['Moz', 'Webkit', 'O', 'ms']
  const len = v.length
  if (isString(s[p])) {
    return p
  }
  p = p.charAt(0).toUpperCase() + p.substr(1)
  for (; i < len; i++) {
    if (isString(s[v[i] + p])) {
      return v[i] + p
    }
  }
  return false
}

/*
* 支持的动画事件
* */
const animation = getPrefix('animation')
const transition = getPrefix('transition')
export const support = {
  name: {
    animation,
    transition
  },
  end: {
    animationEndName: animateEndEventNames[animation],
    transitionEndName: transEndEventNames[transition]
  }
}

/*
* 组装样式字符串
* */
const transformCssText = (prop, {x = 0, y = 0, z = 0}) => {
  return prop + '(' + x + 'px,' + y + 'px,' + z + 'px)'
}
/*
* 设置节点动画动画样式
* */
export const transform = (el = null, {prop = 'translate3d', x = 0, y = 0, z = 0, duration = 0, delay = 0, timing = 'linear', callback = () => {}}) => {
  if (el === null || el.nodeType !== 1) {
    console.error('el参数必须为dom节点')
    return
  }
  let cb = null
  cb = () => {
    callback()
    el.removeEventListener(support.end.transitionEndName, cb, false)
  }
  el.addEventListener(support.end.transitionEndName, cb, false)
  css(el, {
    'transition-property': 'transform',
    'transition-duration': duration + 's',
    'transition-delay': delay + 's',
    'transition-timing-function': timing,
    'transform': transformCssText(prop, {x, y, z})
  })
}
