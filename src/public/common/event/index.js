/**
 * Created by linxiaojie on 2017/1/9.
 */
/*
* 基于jquery的事件发布订阅
* */
const $ = require('jquery')
export default class Event {
  constructor () {
    this.event = $({})
  }
  on () {
    this.event.on.apply(this.event, [].slice.call(arguments))
  }
  off () {
    this.event.off.apply(this.event, [].slice.call(arguments))
  }
  trigger () {
    this.event.trigger.apply(this.event, [].slice.call(arguments))
  }
}
