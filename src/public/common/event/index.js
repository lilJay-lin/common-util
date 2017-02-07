/**
 * Created by linxiaojie on 2017/1/9.
 */
/*
* 事件发布订阅
* */
import {each} from '../util/collection'
import {isString, isFunction} from '../util/object'
export default class Event {
  constructor () {
    this.events = []
  }
  on (type, callback, context) {
    let me = this
    let events = me.events[type] || (me.events[type] = [])
    let event = {
      type,
      callback,
      context
    }
    events.push(event)
  }
  once (type, callback, context) {
    let me = this
    let ctx = context || me
    let one = null
    one = function () {
      let args = [].slice.call(arguments)
      callback.apply(ctx, args)
      me.off(type, one, ctx)
    }
    me.on(type, one, ctx)
  }
  off (type, callback, context) {
    let me = this
    if (!isString(type)) {
      console.error('type参数类型错误')
      return
    }
    if (arguments.length === 2 && !isFunction(callback)) {
      callback = null
      context = callback
    }
    let events = me.events[type]
    if (events) {
      let i = events.length - 1
      let event = null
      for (; i >= 0; i--) {
        event = events[i]
        let eqCtx = !context || event.context === context
        let eqCb = !callback || event.callback === callback
        if (eqCb && eqCtx) {
          events.splice(i, 1)
        }
      }
    }
  }
  trigger (type) {
    let me = this
    let events = me.events[type]
    let args = [].slice.call(arguments, 1)
    if (events) {
      each(events, ({callback, context}) => {
        let ctx = context || this
        callback.apply(ctx, args)
      })
    }
  }
  getEvent () {
    return this.events
  }
}
