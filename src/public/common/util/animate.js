/**
 * Created by linxiaojie on 2017/1/9.
 */
import {isString} from './object.js'
const transEndEventNames = {
  WebkitTransition : 'webkitTransitionEnd',
  MozTransition    : 'transitionend',
  OTransition      : 'oTransitionEnd otransitionend',
  msTransition     : 'MSAnimationEnd',
  transition       : 'transitionend'
}

const animateEndEventNames = {
  WebkitAnimation: 'webkitAnimationEnd',
  OAnimation     : 'oAnimationEnd',
  msAnimation    : 'MSAnimationEnd',
  MozAnimation  : 'animationend',
  animation      : 'animationend'
}

function getPrefix(type) {
  const b = document.body || document.documentElement
  const s = b.style
  let p = type || 'animation'
  let i = 0
  const v = ['Moz', 'Webkit', 'O', 'ms']
  const len = v.length
  if(isString(s[p]))
    return p
  p = p.charAt(0).toUpperCase() + p.substr(1)
  for(; i< len; i++ ) {
    if(isString(s[v[i] + p]))
      return v[i] + p
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