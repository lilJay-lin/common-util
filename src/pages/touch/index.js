/**
 * Created by linxiaojie on 2017/1/3.
 */
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

