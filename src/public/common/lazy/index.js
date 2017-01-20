/**
 * Created by linxiaojie on 2017/1/18.
 *
 * 图片懒加载
 * 1. 判断scrollend,触发scrollend事件
 * 2. 判断滚动频率，超速不加载
 * 3. scrollend或者滚动频率满总的情况下加载图片
 * 4. 配置默认展示图
 */
import {mockScrollEnd} from '../util/mock'
import {each} from '../util/collection'
import {isString} from '../util/object'
const SCROLL = 'scroll'
/*
* 展示图片
* */
const loadImg = ({el, attr, def, delay = 1000}) => {
  let src = el.getAttribute(attr)
  let error = () => {
    setTimeout(() => {
      el.setAttribute(attr, src)
    }, delay)
    el.setAttribute('src', def)
    el.removeEventListener('error', error, false)
  }
  if (src) {
    /*
    * 失败延时1s再加入可加载队列
    * */
    el.addEventListener('error', error, false)
    el.removeAttribute(attr)
    el.setAttribute('src', src)
  }
}

/*
* 计算滚动频率
* */
const computeSpeed = (el) => {
  let getRect = () => document ? document.body.getBoundingClientRect() : el.getBoundingClientRect()
  let rect = getRect()
  let lastPosY = rect.top
  let lastPosX = rect.left
  let avgSpeed = 0
  const speedAttr = []
  const compute = () => {
    let rect = getRect()
    let pos = Math.abs((rect.left - lastPosX) + (rect.top - lastPosY) / 2)
    if (speedAttr.length < 10) {
      speedAttr.push(pos)
    } else {
      speedAttr.shift()
      speedAttr.push(pos)
    }
    let sumSpeed = 0
    each(speedAttr, (val) => {
      sumSpeed = sumSpeed + val
    })
    avgSpeed = sumSpeed / speedAttr.length
    lastPosX = rect.left
    lastPosY = rect.top
  }
  el.addEventListener(SCROLL, compute, false)
  return {
    getAvgSpeed: () => {
      return avgSpeed
    },
    removeComputeSpeed: () => {
      el.removeEventListener(SCROLL, compute, false)
    }
  }
}

/*
* 查询感兴趣的节点
* */
const queryImage = (container, selector) => {
  return container.querySelectorAll(selector)
}
/*
* 监控需要做懒加载的图片
* 1. 动态加载的节点
* */
export default ({attr = 'data-lazy', def = 'default.png', container = null, dynamic = true, speed = 20}) => {
  let vpHeight = 0
  let vpBottom = 0
  let imgSelector = '[' + attr + ']'
  if (!container) {
    container = document
    vpHeight = window.innerHeight
  } else {
    if (isString(container)) {
      container = document.querySelector(container)
    } else if (container.nodeType !== 1) {
      throw new Error('el 参数类型错误，请检查')
    }
    let rect = container.getBoundingClientRect()
    vpHeight = rect.top + rect.height
    vpBottom = rect.top
  }
  /*
  * 模拟scrollend
  * */
  mockScrollEnd(container)
  /*
  * 图片可见区域
  * */
  const isVisible = ({top, bottom}) => {
    let show = top < vpHeight && bottom > vpBottom
    return show
  }
  let images = queryImage(container, imgSelector)
  const SCROLL_END = 'scrollEnd'
  const RESIZE = 'resize'
  /*
   * 计算是否展示图片
   * */
  const compute = () => {
    if (dynamic) {
      images = queryImage(container, imgSelector)
    }
    each(images, (el) => {
      let rect = el.getBoundingClientRect()
      if (isVisible(rect)) {
        loadImg({el, attr, def})
      }
    })
  }
  const {getAvgSpeed, removeComputeSpeed} = computeSpeed(container)
  /*
  * 判断是否在允许加载的频率范围内
  * */
  const dealBySpeed = () => {
    if (speed < getAvgSpeed()) {
      return
    }
    compute()
  }
  container.addEventListener(SCROLL, dealBySpeed, false)
  window.addEventListener(SCROLL_END, compute, false)
  window.addEventListener(RESIZE, compute, false)
  /*
  * 初始计算加载
  * */
  compute()
  /*
  * 返回函数，执行可以注销懒加载
  * */
  return () => {
    removeComputeSpeed()
    container.removeEventListener(SCROLL, dealBySpeed, false)
    window.removeEventListener(SCROLL_END, compute, false)
    window.removeEventListener(RESIZE, compute, false)
  }
}
