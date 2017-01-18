/**
 * Created by linxiaojie on 2017/1/3.
 */
import Timeout from 'common/timeout'
import {tab, longTab, swipeLeft} from 'common/tab'

/*
* tab事件
* */
let offTab = tab('a', function (evt) {
  alert('tab')
  /*
  * 解除事件
  * */
  offTab()
})
longTab('a', function () {
  alert('longTab')
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
