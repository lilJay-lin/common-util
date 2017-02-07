/**
 * Created by linxiaojie on 2017/1/22.
 */
import Scroll from 'common/scroll'
require('./index.less')

/* eslint-disable no-unused-vars */
document.addEventListener('DOMContentLoaded', () => {
  let scroll = new Scroll({container: '.scroll-container', pushDisable: true})
  /*
  * 下拉
  * 停止下拉：scroll.disablePull(1)
  * 加载结束：scroll.pullOver()
  * */
  scroll.on('scroll.pull', () => {
    setTimeout(() => {
      scroll.pullOver()
    }, 2000)
  })
  /*
  * 上拉
  * 停止上拉：scroll.disablePush(1)
  * 加载结束：scroll.pushOver()
  * */
  scroll.on('scroll.push', () => {
    setTimeout(() => {
      alert('push loaded')
      scroll.pushOver()
      scroll.disablePush(1)
    }, 2000)
  })
}, false)

