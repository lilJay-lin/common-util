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
import {isVisible as domVisible} from '../util/dom'
import {isEmpty} from '../util/string'

let SCROLL = ''
/*
* 展示图片
* */
const loadImg = ({el, attr, def, delay = 1000}) => {
  let src = el.getAttribute(attr)
  let oldSrc = el.getAttribute('src')
  oldSrc = isEmpty(oldSrc) ? def : oldSrc
  let error = () => {
    /*
    * 重新加入加载队列
    * */
    setTimeout(() => {
      el.setAttribute(attr, src)
    }, delay)
    el.setAttribute('src', oldSrc)
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
* @param{string} attr: 需要做懒加载的图书节点属性
* @param{string} def: 默认显示图片
* @param{string|element} container: 容器节点，不传默认为document
* @param{boolean} dynamic: 是否动态加载所有需要做懒加载的节点
* @param{number} speed: 只在指定频率内的滚动才做懒加载
* @param{boolean} mobile: 是否使用手机模式，这里不使用平台来判断强制使用，因为移动端有时候也不想用手机模式（touchmove）
* */
export default ({attr = 'data-lazy', def = 'default.png', container = null, dynamic = true, speed = 20, mobile = false}) => {
  let vpHeight = 0
  let vpBottom = 0
  let imgSelector = '[' + attr + ']'
  let images = []
  const SCROLL_END = 'scrollEnd'
  const RESIZE = 'resize'
  SCROLL = mobile ? 'touchmove' : 'scroll'
  if (!container) {
    container = document
    vpHeight = window.innerHeight
  } else {
    if (isString(container)) {
      container = document.querySelector(container)
    } else if (container && container.nodeType !== 1) {
      throw new Error('el 参数类型错误，请检查')
    }
    let rect = container.getBoundingClientRect()
    vpHeight = rect.top + rect.height
    vpBottom = rect.top
  }
  images = queryImage(container, imgSelector)
  /*
  * 模拟scrollend
  * */
  mockScrollEnd({container, mobile})
  /*
  * 图片可见区域
  * */
  const isVisible = ({top, bottom}) => {
    let show = !(top > vpHeight || bottom < vpBottom)
    return show
  }
  /*
   * 计算是否展示图片
   * */
  const compute = () => {
    /*
    * 容器可见
    * */
    if (container !== document && !domVisible(container)) {
      return
    }
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
  return {
    refresh: compute,
    destroy () {
      removeComputeSpeed()
      container.removeEventListener(SCROLL, dealBySpeed, false)
      window.removeEventListener(SCROLL_END, compute, false)
      window.removeEventListener(RESIZE, compute, false)
    }
  }
}
