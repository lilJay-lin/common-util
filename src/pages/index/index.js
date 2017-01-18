/**
 * Created by linxiaojie on 2017/1/3.
 */
import Timeout from 'common/timeout'
import {tap, longTap, swipeLeft} from 'common/touch'

/*
* tab事件
* */
let offTap = tap('a', function (evt) {
  alert('tap')
  /*
  * 解除事件
  * */
  offTap()
})
longTap('a', function () {
  alert('longTap')
})
swipeLeft('a', function () {
  alert('swipeLeft')
})

/*
* 定时器
* */
const timeout = new Timeout({el: '#timeout'})
timeout.on('start.timecount', () => {
  console.log('start')
})

timeout.on('over.timecount', () => {
  console.log('over')
})
