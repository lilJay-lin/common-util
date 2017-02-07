/**
 * Created by linxiaojie on 2017/1/22.
 */
import Event from 'common/event'
let should = require('chai').should()
describe("events.js", () => {
  let event = new Event()
  let es = []
  let cxt = {name: 'event_test'}
  const start = function (num) {
    console.log('start-----' + num + ' ' + this.name)
  }
  /*
  * 绑定事件
  * */
  event.on('start', start, cxt)
  es = event.getEvent()
  es['start'].should.be.length(1)

  /*
  * 触发事件
  * */
  event.trigger('start', 'test')
  /*
   * 解除事件绑定
   * */
  event.off('start', start, cxt)
  es['start'].should.be.length(0)

  /*
  * 一次性事件
  * */
  event.once('start.once', function (type) {
    console.log('start.once is trigger: ' + type + ',' + this.name + '----------')
  }, cxt)
  es['start.once'].should.be.length(1)
  event.trigger('start.once', 'once')
  es['start.once'].should.be.length(0)
})