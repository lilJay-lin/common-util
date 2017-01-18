/**
 * Created by linxiaojie on 2017/1/9.
 */
import Event from '../event'
import {tap} from '../touch'
const $ = require('jquery')
export default class Timeout extends Event {
  constructor ({el = '', disabledClass = 'disabled', text = '发送验证码', disabledCb = (count) => {
    return '发送（' + count + '）秒'
  }, seconds = 60}) {
    super({})
    if (el === '') {
      throw new Error('el不能为空')
    }
    const me = this
    me.el = el
    me.$el = $(me.el)
    me.disabledClass = disabledClass
    me.text = text
    me.disabledCb = disabledCb
    me.seconds = seconds
    me._counted = 0
    me.timeout = null
    me.offTap = null
    me.init()
  }
  init () {
    let me = this
    let $el = me.$el
    $el.removeClass(me.disabledClass)
    $el.text(me.text)
    me.offTap && me.offTap()
    me.offTap = tap($el.get(0), function (e) {
      e.preventDefault()
      if ($el.hasClass(me.disabledClass)) {
        return
      }
      me.start()
    })
  }
  start () {
    let me = this
    let $el = me.$el
    let disabledClass = me.disabledClass
    if ($el.hasClass(disabledClass)) {
      return
    }
    me._counted = 0
    me.trigger('start.timecount')
    me.count()
  }
  restart () {
    this.init()
  }
  count () {
    let me = this
    let counted = me._counted
    let $el = me.$el
    $el.addClass(me.disabledClass)
    $el.text(me.disabledCb(me.seconds - counted))
    me.timeout && clearTimeout(me.timeout)
    me.timeout = setTimeout($.proxy(function () {
      if (counted === me.seconds) {
        me.restart()
        me.trigger('over.timecount')
      } else {
        me._counted ++
        me.count()
      }
    }, me), 1000)
  }
}
