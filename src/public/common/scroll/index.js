/**
 * Created by linxiaojie on 2017/1/22.
 * 1. 模拟滚动，使用touchmove模拟滚动
 * 2. 下拉刷新
 * 3. 上啦刷新
 * 4. 刷新加载动画
 * 5. 失败重载
 * 6.
 */
import {css, removeClass, addClass} from '../util/dom'
import {transform} from '../util/animate'
import MoveDetection from './move'
import * as touch from '../touch'
/*
 * 下拉刷新事件主题
 * */
const PULL_PUB = 'scroll.pull'
const PULL_PUB_ERROR = 'scroll.pull.error'
const PULL_PUB_OVER = 'scroll.pull.over'
/*
 * 上拉刷新事件主题
 * */
const PUSH_PUB = 'scroll.push'
const PUSH_PUB_ERROR = 'scroll.push.error'
const PUSH_PUB_OVER = 'scroll.push.over'

/*
* 指示器不同状态Class
* */
const pullBarSelector = '.scroll-pull-bar'
const pushBarSelector = '.scroll-push-bar'
const toActiveClass = 'scroll-bar-to-active'
const activeClass = 'scroll-bar-active'
const errorClass = 'scroll-bar-error'
const retryClass = 'scroll-bar-retry'

/*
 * @param{String|Element}container容器
 * @param{String} content 内容节点，默认为‘.scroll-content’
 * @param{String|Number}height: 内容高度，默认为父容器100%
 * @param{Number}flexRadio 弹性抵抗,出现指示器的移动范围，增加弹性抵抗
 * @param{Number}loadingRadio 提示放开开始刷新的指示器位置（百分比）
 * @param{Number}flexDis 默认弹性距离
 * @param{boolean}pullDisable 是否禁止下拉
 * @param{boolean}pushDisable 是否禁止上拉
 *
 * */
export default class Scroll extends MoveDetection {
  constructor ({container, content = '.scroll-content', height = null, flexRadio = 0.1, loadingRadio = 0.7, flexDis = 60, pullDisable = false, pushDisable = false}) {
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
    me.contentHeight = null
    me.loadingRadio = loadingRadio
    me.flexRadio = flexRadio
    /*
     * 上拉(push)、下拉(pull)指示器
     *
     * */
    me.pullBar = me.detectCnt.querySelector('.scroll-pull-bar')
    me.pushBar = me.detectCnt.querySelector('.scroll-push-bar')
    me.pullHeight = (me.pullBar === null || pullDisable) ? flexDis : parseInt(css(me.pullBar, 'height'), 10)
    me.pushHeight = (me.pushBar === null || pushDisable) ? flexDis : parseInt(css(me.pushBar, 'height'), 10)

    me.disablePull(pullDisable)
    me.disablePush(pushDisable)
    /*
     * 记录累计的滑动距离
     * */
    me.totalMoveY = 0
    /*
     * 加载状态
     * 0 未加载
     * 1 加载中
     * 2 异常
     * */
    me.pullLoading = 0
    me.pushLoading = 0
    me.initViewport()
    me.bindEvent()
  }
  initViewport (height = '100%') {
    css(this.detectCnt, {
      height
    })
  }
  bindEvent () {
    let me = this
    if (me.pullBar) {
      let pullRetry = me.content.querySelector(pullBarSelector + ' .' + retryClass)
      touch.tap(pullRetry, () => {
        me.clickReload('pull')
      })
      me.on(PULL_PUB_OVER, () => {
        me.pullLoading = 0
        /*
         * 如果可视区域显示了指示器，加载完毕做指示器隐藏
         * */
        if (me.totalMoveY > 0) {
          me.totalMoveY = me.totalMoveY - me.pullHeight
          transform(me.content, {
            y: me.totalMoveY,
            duration: 0
          })
        }
      })
      me.on(PULL_PUB_ERROR, () => {
        me.pullLoading = 2
        removeClass(me.pullBar, [activeClass, toActiveClass])
        addClass(me.pullBar, errorClass)
      })
    }

    if (me.pushBar) {
      let pushRetry = me.content.querySelector(pushBarSelector + ' .' + retryClass)
      touch.tap(pushRetry, () => {
        me.clickReload('push')
      })
      me.on(PUSH_PUB_OVER, () => {
        me.pushLoading = 0
        /*
        * 如果可视区域显示了指示器，加载完毕做指示器隐藏
        * */
        if (me.getMaxScrollDis() > me.totalMoveY) {
          me.totalMoveY = me.totalMoveY + me.pushHeight
          transform(me.content, {
            y: me.totalMoveY,
            duration: 0
          })
        }
      })
      me.on(PUSH_PUB_ERROR, () => {
        me.pushLoading = 2
        removeClass(me.pushBar, [activeClass, toActiveClass])
        addClass(me.pushBar, errorClass)
      })
    }
  }
  destroy () {
    let me = this
    me.off(PULL_PUB_OVER)
    me.off(PUSH_PUB_OVER)
    me.off(PULL_PUB_ERROR)
    me.off(PUSH_PUB_ERROR)
    me.destroyComponent()
  }
  dealMove (evt, {disX, disY}) {
    let me = this
    /*
     * 通过首次移动来判断方向，只处理垂直方向滚动
     * */
    if (me.isMove === 0 && Math.abs(disY) > Math.abs(disX)) {
      super.dealMove(evt, {disX, disY})
    }
    /*
     * 只处理有效触摸
     * */
    if (me.isMove) {
      let dis = parseInt(disY, 10)
      me.updateDirectBar(dis)
      transform(me.content, {
        y: me.fixedTotalMoveY(dis, me.pullHeight, me.pushHeight)
      })
    }
  }
  /*
   * 根据指示器展示内容判断是否需要触发更新
   * */
  dealEnd (evt) {
    let me = this
    /*
     * 触摸结束，记录滑动距离
     * */
    if (me.isMove) {
      let disY = me.lastTouch.pageY - me.startTouch.pageY
      /*
      * 重新计算可滑动位置
      * */
      let totalMoveY = me.fixedTotalMoveY(disY, me.pullHeight, me.pushHeight)
      let status = me.getBarStatus(disY)
      /*
       * 判断是否满足刷新条件： 指示器展示刷新数据
       * status 2 : 非刷新，展示了指示器需要隐藏
       * status 3: 刷新，展示完整指示器
       * */
      if (status === 2 || status === 6) {
        totalMoveY = me.fixedTotalMoveY(disY)
        transform(me.content, {
          y: totalMoveY,
          duration: 0.5
        })
      } else if (status === 3) {
        me.updateRefreshStatus(disY)
        totalMoveY = disY > 0 ? me.pullHeight : me.getMaxScrollDis() - me.pushHeight
        transform(me.content, {
          y: totalMoveY,
          duration: 0
        })
      }
      me.totalMoveY = totalMoveY
    }
    super.dealMove(evt)
  }
  /*
  * 上拉到底部距离
  * */
  getMaxScrollDis () {
    let me = this
    if (!me.contentHeight) {
      me.refreshContentHeight()
    }
    return me.viewport.h - me.contentHeight
  }
  /*
  * 设置内容高度
  * 每次加载刷新需要调用
  * */
  refreshContentHeight () {
    this.contentHeight = parseInt(css(this.content, 'height'), 10)
  }
  /*
  * 溢出可视区的滑动计算
  * */
  fixedTotalMoveY (dis, top = 0, bottom = 0) {
    let me = this
    let totalMoveY = me.totalMoveY + dis
    let scrollDis = me.getMaxScrollDis()
    let radio = 1
    /*
    * 出现指示器之后的移动像素，增加弹性抵抗
    * */
    if (totalMoveY > 0) {
      radio = me.pullLoading === 0 ? me.flexRadio : 1
      totalMoveY = totalMoveY * radio
      return totalMoveY < top ? totalMoveY : top
    } else if (totalMoveY < scrollDis) {
      radio = me.pushLoading === 0 ? me.flexRadio : 1
      let max = scrollDis - bottom
      totalMoveY = (totalMoveY - scrollDis) * radio + scrollDis
      return totalMoveY < max ? max : totalMoveY
    } else {
      return totalMoveY
    }
  }
  /*
  * 滑动到展示指示器临界点
  * @param{number}disY: 当前滑动距离
  * @return  0:未到指示器位置；other: 展示指示器高度
  * */
  computedDirectBar (disY) {
    let me = this
    let maxScroll = me.getMaxScrollDis()
    let totalMoveY = me.fixedTotalMoveY(disY, me.pullHeight, me.pushHeight)
    return totalMoveY > 0 ? totalMoveY : totalMoveY < maxScroll ? totalMoveY - maxScroll : 0
  }
  /*
  * 滑动指示器
  * @param{number}disY: 当前滑动距离
  * */
  updateDirectBar (disY) {
    let me = this
    let bar = disY > 0 ? me.pullBar : me.pushBar
    if (bar) {
      let status = me.getBarStatus(disY)
      if (status === 4) {
        removeClass(bar, [toActiveClass, errorClass])
        addClass(bar, activeClass)
      } else if (status === 5) {
        removeClass(bar, [toActiveClass, activeClass])
        addClass(bar, errorClass)
      } else if (status === 3) {
        removeClass(bar, [activeClass, errorClass])
        addClass(bar, toActiveClass)
      } else if (status === 2) {
        removeClass(bar, [activeClass, errorClass, toActiveClass])
      }
    }
  }
  /*
  * 返回需要触发的状态： 1. 正常滑动 2. 展示下拉或上拉提示 3. 展示松开刷新提示 4. 正在刷新 5 异常 6 无指示节点，不需要做刷新指示处理
  * @param{number}disY: 当前滑动距离
  * @return{number} 1/2/3/4
  * */
  getBarStatus (disY) {
    let me = this
    let res = 1
    let dis = me.computedDirectBar(disY)
    let isUp = dis > 0
    let isDown = dis < 0
    if (dis) {
      /*
      * 已经在刷新
      * */
      if (isUp && (me.pullBar === null || me.pullDisable) || isDown && (me.pushBar === null || me.pushDisable)) {
        res = 6
      } else if (isUp && me.pullLoading === 1 || isDown && me.pushLoading === 1) {
        res = 4
      } else if (isUp && me.pullLoading === 2 || isDown && me.pushLoading === 2) {
        res = 5
      } else {
        /*
        * 是否展示刷新
        * */
        let showHeight = (isUp ? me.pullHeight : me.pushHeight) * me.loadingRadio
        res = Math.abs(dis) > showHeight ? 3 : 2
      }
    }
    return res
  }
  /*
  * 设置刷新状态
  * */
  updateRefreshStatus (dirY) {
    let me = this
    if (dirY > 0 && me.pullLoading === 0 && !me.pullDisable) {
      me.pullLoading = 1
      me.trigger(PULL_PUB)
    } else if (dirY < 0 && me.pushLoading === 0 && !me.pushDisable) {
      me.pushLoading = 1
      me.trigger(PUSH_PUB)
    }
    me.updateDirectBar(dirY)
  }
  /*
  * 加载异常，点击重试
  * */
  clickReload (dir) {
    let me = this
    if (dir === 'pull') {
      me.pullLoading = 1
      me.trigger(PULL_PUB)
      me.updateDirectBar(1)
    } else {
      me.pushLoading = 1
      me.trigger(PUSH_PUB)
      me.updateDirectBar(-1)
    }
  }
  disablePull (status) {
    this.disable('pull', status)
  }
  disablePush (status) {
    this.disable('push', status)
  }
  disable (type, status) {
    let me = this
    let disabled = !!status
    let visibility = disabled ? 'hidden' : 'visible'
    let bar = null
    if (type === 'pull') {
      me.pullDisable = disabled
      bar = me.pullBar
    }
    if (type === 'push') {
      me.pushDisable = disabled
      bar = me.pushBar
    }
    if (bar) {
      css(bar, {
        visibility: visibility
      })
    }
  }
  pullOver () {
    this.trigger(PULL_PUB_OVER)
  }
  pushOver () {
    this.trigger(PUSH_PUB_OVER)
  }
}
