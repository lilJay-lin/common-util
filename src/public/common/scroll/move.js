/**
 * Created by linxiaojie on 2017/1/23.
 * 检测滑动事件，做基本的touchmove处理
 * 子类通过重载dealStart、dealMove、dealEnd做业务处理
 *
 */
import Event from '../event'
import {isString} from '../util/object'
import {css} from '../util/dom'
export default class MoveDetection extends Event {
  constructor ({container}) {
    super({})
    let me = this
    let detectCnt = null
    if (isString(container)) {
      detectCnt = document.querySelector(container)
    } else if (container && container.nodeType) {
      detectCnt = container
    } else {
      console.error('container 参数类型错误，请检查')
      return
    }
    if (detectCnt === null) {
      console.error('指定容器节点不存在，请检查:' + container)
      return
    }
    me.detectCnt = detectCnt
    /*
    * 是否有效滑动
    * */
    me.isMove = 0
    /*
    * 滑动判断敏感度
    * */
    me.scrollSuppressionThreshold = 10
    /*
     *
     identify: 0,
     timeStamp: 0,
     pageX: 0,
     pageY: 0
     * */
    me.startTouch = null
    me.lastTouch = null
    /*
     * 可视内容宽高度
     * */
    me.viewport = {
      width: parseInt(css(detectCnt, 'width'), 10),
      height: parseInt(css(detectCnt, 'height'), 10)
    }
    /*
    * 返回事件注销方法
    * */
    me.destroyComponent = me.init()
    return this
  }
  init () {
    let me = this
    let detectCnt = me.detectCnt
    const touchStart = (evt) => {
      let {identify, timeStamp, pageX, pageY} = evt.touches[0]
      me.startTouch = {identify, timeStamp, pageX, pageY}
      me.dealStart(evt)
    }
    const touchMove = (evt) => {
      let changeTouches = evt.changedTouches
      if (changeTouches.length === 0 || me.startTouch === null) {
        return
      }
      let {identify, timeStamp, pageX, pageY} = changeTouches[0]
      let lastTouch = me.lastTouch = {identify, timeStamp, pageX, pageY}
      let disX = lastTouch.pageX - me.startTouch.pageX
      let disY = lastTouch.pageY - me.startTouch.pageY
      if (Math.max(Math.abs(disX), Math.abs(disY)) > me.scrollSuppressionThreshold) {
        evt.preventDefault()
        me.dealMove(evt, {disX, disY})
      }
    }
    const touchEnd = (evt) => {
      me.dealEnd(evt)
      me.startTouch = null
      me.isMove = 0
    }
    detectCnt.addEventListener('touchstart', touchStart, false)
    detectCnt.addEventListener('touchmove', touchMove, false)
    detectCnt.addEventListener('touchend', touchEnd, false)

    return () => {
      detectCnt.removeEventListener('touchstart', touchStart, false)
      detectCnt.removeEventListener('touchmove', touchMove, false)
      detectCnt.removeEventListener('touchend', touchEnd, false)
      me.detectCnt.parentNode.removeChild(me.detectCnt)
      me.detectCnt = me.startTouch = me.lastTouch = null
    }
  }
  dealStart (evt) {}
  /*
  * 移动中做处理
  * */
  dealMove (evt, options) {
    this.isMove = 1
  }
  dealEnd (evt) {}
}
