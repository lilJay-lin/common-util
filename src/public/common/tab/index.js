/**
 * Created by linxiaojie on 2017/2/7.
 */
import Event from '../event'
import {tap} from '../touch'
import {each} from '../util/collection'
import {isString} from '../util/object'
import {data, addClass, removeClass} from '../util/dom'

const TAB_CHANGED = 'tab.changed'
/*
* @param {String|Element} container 容器节点
* @param {String} tab 选项卡标题组容器节点
* @param {String} tabContent 选项卡内容组容器节点
* @param {Number} active: 当前激活选项卡索引
* @param {String} activeClass: 激活的选卡增加className
* */
export default class Tab extends Event {
  constructor ({container = '.tabs', tab = '.tabs-bar', tabContent = '.tabs-content', active = 0, activeClass = 'active'}) {
    super()
    let ctn = null
    let me = this
    if (isString(container)) {
      ctn = document.querySelector(container)
    } else if (container && container.nodeType) {
      ctn = container
    } else {
      console.error('container 参数类型错误，请检查')
      return
    }
    if (ctn === null) {
      console.error('指定容器参数container节点为空，请检查')
      return
    }
    let $tab = ctn.querySelector(tab)
    let $tabContent = ctn.querySelector(tabContent)
    if ($tab === null || $tabContent === null) {
      console.error('找不到指定容器tab 或者 tabContent，请检查')
      return
    }
    me.tabs = $tab.children
    me.tabContents = $tabContent.children
    me.ctn = ctn
    me.active = active
    me.activeClass = activeClass
    if (me.tabs && me.tabContents) {
      me.initView()
    }
  }
  initView () {
    let me = this
    let active = me.active
    me.bindEvent()
    me.setActive(active)
  }
  bindEvent () {
    let me = this
    each(me.tabs, (tab, idx) => {
      data(tab, {
        idx
      })
      tap(tab, () => {
        let active = me.active
        let idx = parseInt(data(tab, 'idx'), 10)
        me.setActive(idx)
        me.trigger(TAB_CHANGED, active, idx)
      })
    })
  }
  changeTab (index) {
    this._change(this.tabs, index)
  }
  changeTabContent (index) {
    this._change(this.tabContents, index)
  }
  _change (els, index) {
    let me = this
    let activeClass = me.activeClass
    each(els, (content, idx) => {
      index === idx ? addClass(content, activeClass) : removeClass(content, activeClass)
    })
  }
  setActive (active) {
    let me = this
    me.active = active
    me.changeTab(active)
    me.changeTabContent(active)
  }
}
