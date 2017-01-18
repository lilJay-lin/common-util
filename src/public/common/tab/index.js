/**
 * Created by linxiaojie on 2017/1/17.
 *
 * Tap 移动端模拟tap点击事件
 *
 * $el.tap(type, cb)
 *
 * 1. 触摸时长不超过250ms
 * 2. 移动范围不超过 20 * 20
 * 3. 100ms内两次tap，触发doubleTap
 * touchstart  timestamp
 * touchmove timestamp abs(sx - ms) | abs(sy - my) > 20 ? ismove : tap
 * touchend timestamp
 *
 */
import {proxy, isString, isArrayLike} from '../util/object'
import {each} from '../util/collection'
/*
* import {each} from '../util/collection'
 each(['tab', 'doubleTap', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'], (val) => {

 })
* */

/*
* 触摸移动敏感度
* */
const scrollSuppressionThreshold = 10

/*
* 根据指定策略来处理需要判断是否触发指定事件
* @param{obj} strategy 各种事件判断的策略方法
* @return function
* */
const dealTouch = (strategy) => {
  return (type, selector, cb) => {
    /*
     * 最后一次触摸记录
     * */
    let lastTouch = {
      timestamp: 0,
      x: 0,
      y: 0
    }
    /*
     * 开始一次新触摸记录
     * */
    let startTouch = {
      timestamp: 0,
      x: 0,
      y: 0
    }
    /*
     * 标记触摸是否有效
     * */
    let validateTouch = 0

    /*
     * 绑定节点
     * */
    let els = null
    if (isString(selector)) {
      els = document.querySelectorAll(selector)
    } else if (selector.nodeType) {
      els = selector
    } else {
      throw new Error('el 参数类型错误，请检查')
    }
    els = isArrayLike(els) ? els : [els]

    const proxyCb = proxy(cb, els)

    const touchStart = (evt) => {
      /*
      * 阻止默认行为
      * */
      evt.preventDefault()
      let touches = evt.touches
      if (touches.length > 1) {
        return
      }
      let touch = touches[0]
      if (touch) {
        let {pageX, pageY} = touch
        validateTouch = 1
        startTouch = {
          timestamp: evt.timeStamp,
          x: pageX,
          y: pageY
        }
      }
    }
    const touchMove = (evt) => {
      let touches = evt.changedTouches
      let touch = null
      if (touches.length > 0) {
        touch = touches[0]
      }
      if (touch) {
        let {pageX, pageY} = touch
        lastTouch = {
          timestamp: evt.timeStamp,
          x: pageX,
          y: pageY
        }
        if (Math.max(Math.abs(lastTouch.x - startTouch.x), Math.abs(lastTouch.y - startTouch.y)) > scrollSuppressionThreshold) {
          evt.preventDefault()
        }
      }
    }
    const touchEnd = (evt) => {
      if (!validateTouch) {
        return
      }
      let touches = evt.changedTouches
      let touch = null
      if (touches.length > 0) {
        touch = touches[0]
      }
      if (touch) {
        let {pageX, pageY} = touch
        lastTouch = {
          timestamp: evt.timeStamp,
          x: pageX,
          y: pageY
        }
        /*
         * 触发不同的事件
         * */
        if (strategy[type](startTouch, lastTouch)) {
          proxyCb(evt)
        }
      }
      validateTouch = 0
      startTouch = {
        timestamp: 0,
        x: 0,
        y: 0
      }
    }
    const touchCancel = (evt) => {
      validateTouch = 0
      startTouch = {
        timestamp: 0,
        x: 0,
        y: 0
      }
    }
    each(els, (el) => {
      el.addEventListener('touchstart', touchStart)
      el.addEventListener('touchmove', touchMove)
      el.addEventListener('touchend', touchEnd)
      el.addEventListener('touchcancel', touchCancel)
    })

    /*
     * 返回事件注销函数
     * */
    return () => {
      each(els, (el) => {
        el.removeEventListener('touchstart', touchStart)
        el.removeEventListener('touchmove', touchMove)
        el.removeEventListener('touchend', touchEnd)
        el.removeEventListener('touchcancel', touchCancel)
      })
    }
  }
}

/*
* 判断各种事件触发时机策略
* */
const TAP = 'TAP'
const LONG_TAP = 'LONG_TAP'
const SWIPE_LEFT = 'swipeLeft'
const SWIPE_RIGHT = 'swipeRight'
const SWIPE_UP = 'swipeUp'
const SWIPE_DOWN = 'swipeDown'
/*
判断是否双击需要把单机事件延时触发，考虑到双击场景较少，暂不支持双击
const DOUBLE_TAP = 'DOUBLE_TAP'
* */
const getMaxDis = (start, last) => {
  return Math.max(Math.abs(last.x - start.x) || Math.abs(last.y - start.y))
}
const swipe = (start, last) => {
  const disX = last.x - start.x
  const disY = last.y - start.y
  const absX = Math.abs(disX)
  const absY = Math.abs(disY)
  /*
  * 移动20px才判断为swipe
  * */
  if (absX > 20 || absY > 20) {
    return absX > absY ? disX > 0 ? SWIPE_RIGHT : SWIPE_LEFT : disY > 0 ? SWIPE_DOWN : SWIPE_UP
  }
  return ''
}
const strategy = {
  [TAP]: (start, last) => {
    let dis = getMaxDis(start, last)
    let res = false
    if (dis <= scrollSuppressionThreshold && last.timestamp - start.timestamp <= 250) {
      res = true
    }
    return res
  },
  [LONG_TAP]: (start, last) => {
    let res = false
    let dis = getMaxDis(start, last)
    if (dis <= scrollSuppressionThreshold && last.timestamp - start.timestamp >= 750) {
      res = true
    }
    return res
  },
  [SWIPE_LEFT]: (start, last) => {
    let res = false
    if (swipe(start, last) === SWIPE_LEFT) {
      res = true
    }
    return res
  },
  [SWIPE_RIGHT]: (start, last) => {
    let res = false
    if (swipe(start, last) === SWIPE_RIGHT) {
      res = true
    }
    return res
  },
  [SWIPE_UP]: (start, last) => {
    let res = false
    if (swipe(start, last) === SWIPE_UP) {
      res = true
    }
    return res
  },
  [SWIPE_DOWN]: (start, last) => {
    let res = false
    if (swipe(start, last) === SWIPE_DOWN) {
      res = true
    }
    return res
  }
}

export const tab = (el, cb) => {
  return dealTouch(strategy)(TAP, el, cb)
}

export const longTab = (el, cb) => {
  return dealTouch(strategy)(LONG_TAP, el, cb)
}

export const swipeLeft = (el, cb) => {
  return dealTouch(strategy)(SWIPE_LEFT, el, cb)
}

export const swipeRight = (el, cb) => {
  return dealTouch(strategy)(SWIPE_RIGHT, el, cb)
}

export const swipeUp = (el, cb) => {
  return dealTouch(strategy)(SWIPE_UP, el, cb)
}

export const swipeDown = (el, cb) => {
  return dealTouch(strategy)(SWIPE_DOWN, el, cb)
}
