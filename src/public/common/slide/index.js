/**
 * Created by linxiaojie on 2017/2/7.
 *
 * 1. 滚动方向：水平和垂直
 * 2. 是否循环
 * 3. 整个滑动？展示部分不移动，指定方向拉出？
 *
 * move -> transitionMove 展示触摸过程的效果
 * 1. 触发整块移动
 * 2. 触摸过程移动
 * transform  ---> 滑动item
 * setActive ---> 更新激活的索引
 *
 */
import MoveDetection from '../scroll/move'
import {transform} from '../util/animate'
import {HORIZON, VERTICAL} from './constants'
import {css} from '../util/dom'
import {each} from '../util/collection'

/*
* 组合，处理具体滑动
* 1. transform 滑动调用的移动方法
* 2. dealEnd结束触摸
* */
class SlideAll {
  constructor (slide) {
    let me = this
    me.slide = slide
    me.maxScroll = 0
    me.totalMove = 0
  }
  /*
   * 最大滑动距离
   * */
  getMaxScroll () {
    let me = this
    if (me.maxScroll) {
      return me.maxScroll
    }
    let slide = me.slide
    let prop = slide.getProp()
    return (me.maxScroll = slide.getRelViewportVal() - parseInt(css(slide.content, prop), 10))
  }
  /*
  * 移动元素
  * */
  transform ({disX, disY}) {
    let me = this
    let isHorizon = me.slide.isHorizon()
    let dis = me.computedScrollDis(isHorizon ? disX : disY, me.slide.flexDis)
    transform(me.slide.content, isHorizon ? {x: dis} : {y: dis})
  }
  /*
  *  计算滑动距离
  * */
  computedScrollDis (dis, flexDis = 0) {
    let me = this
    let totalMove = me.totalMove
    let maxScroll = me.getMaxScroll() - flexDis
    let fixDis = dis + totalMove
    return fixDis > flexDis ? flexDis : fixDis < maxScroll ? maxScroll : fixDis
  }
  /*
  * 滑动结束触摸调用
  * */
  dealEnd (dis, active, nextActive) {
    let me = this
    let slide = me.slide
    let options = null
    let duration = slide.duration
    /*
    * 切换到正确item
    * */
    let totalMove = slide.getRelViewportVal() * nextActive * -1
    options = slide.isHorizon() ? {x: totalMove, duration} : {y: totalMove, duration}
    transform(slide.content, options)
    me.totalMove = totalMove
  }
}

/*
 * @param {String|Element} container容器
 * @param {String} content内容容器
 * @param {String} item滑动内容块
 * @param {String}direction 滑动方向： vertical | horizon
 * @param {Number} active 初始显示item索引
 * @param{Number}flexDis 默认弹性距离
 * @param{Number}duration 默认切换效果时间间隔，单位秒
 * @param{Number}minMove 触发切页的最小移动距离
 */
export default class Slide extends MoveDetection {
  constructor ({container = '.slide-wrapper', content = '.slide', item = '.slide-item', direction = HORIZON, active = 0, duration = 0.5, SlideMode = SlideAll, minMove = 150, flexDis = 50}) {
    super({container})
    let me = this
    if (!me.detectCnt) {
      return
    }
    /*
     * 内容节点
     * */
    me.content = me.detectCnt.querySelector(content)
    if (me.content === null) {
      console.error('找不到滚动的内容，请检查(class=' + content + ')')
      return
    }
    me.slideItems = me.content.querySelectorAll(item)
    me.length = me.slideItems ? me.slideItems.length : 0
    me.direction = direction
    me.active = active
    me.minMove = minMove
    me.duration = duration
    me.flexDis = flexDis
    me.mode = new SlideMode(me)
    me.initView()
  }
  dealMove (evt, {disX, disY}) {
    let me = this
    let mode = me.mode
    /*
     * 通过首次移动来判断方向，只处理感兴趣方向滚动
     * */
    if (me.isMove === 0 && me.computedDirection({disX, disY}) === me.direction) {
      super.dealMove(evt, {disX, disY})
      return
    }
    if (me.isMove) {
      mode.transform({disX, disY})
    }
  }
  /*
   * 触摸结束
   * */
  dealEnd (evt) {
    let me = this
    if (me.isMove) {
      let me = this
      let lastTouch = me.lastTouch
      let startTouch = me.startTouch
      let dis = me.isHorizon() ? lastTouch.pageX - startTouch.pageX : lastTouch.pageY - startTouch.pageY
      /*
      * 处理触摸结束效果
      * */
      let active = me.active
      let newActive = Math.abs(dis) > me.minMove ? me.getActive(dis < 0) : me.active
      me.mode.dealEnd(dis, active, newActive)
      me.active = newActive
    }
    super.dealEnd(evt)
  }
  /*
  * 初始化容器宽高度
  * 1 多个水平或者垂直排列，整体滑动
  *   1. 水平，容器宽度 = item * num
  *   2. 垂直， 容器长度 = item * num
  * 2 只上一个或者下一个item
  *   容器宽高度同item
  * */
  initView () {
    let me = this
    let {width, height} = me.viewport
    let props = me.isHorizon() ? {width: width + 'px', height: '100%'} : {width: '100%', height: height + 'px'}
    /*
    * 设置item，宽高度
    * */
    each(me.slideItems, (item) => {
      css(item, props)
    })
    /*
    * 水平方向设置内容宽
    * */
    me.isHorizon() && css(me.content, {width: me.length * width + 'px'})
  }
  /*
  * 滑动方向
  * */
  computedDirection ({disX, disY}) {
    return Math.abs(disX) > Math.abs(disY) ? HORIZON : VERTICAL
  }
  /*
   * isVertical
   * */
  isVertical () {
    return this.direction === VERTICAL
  }
  /*
   * isHorizon
   * */
  isHorizon () {
    return this.direction === HORIZON
  }
  /*
  * 获取上/下一个active
  * */
  getActive (next) {
    let me = this
    let active = me.active
    let len = me.length
    active = next ? active + 1 : active - 1
    return active < 0 ? 0 : active < len ? active : len - 1
  }
  /*
  * 激活下一个item
  * */
  next () {

  }
  /*
  * 激活上一个item
  * */
  pre () {

  }
  getProp () {
    return this.isHorizon() ? 'width' : 'height'
  }
  /*
  * 获取视窗属性值
  * 根据direct的值：
  * 水平返回宽度
  * 垂直返回高度
  * */
  getRelViewportVal () {
    return this.viewport[this.getProp()]
  }

}
