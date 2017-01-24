/**
 * Created by linxiaojie on 2017/1/22.
 */
import Scroll from 'common/scroll'
require('./index.less')

/* eslint-disable no-unused-vars */
document.addEventListener('DOMContentLoaded', () => {
  let scroll = new Scroll({container: '.scroll-container'})
  scroll.on('scroll.pull', () => {
    setTimeout(() => {
      scroll.trigger('scroll.pull.error')
      scroll.destroy()
    }, 2000)
  })
  scroll.on('scroll.push', () => {
    setTimeout(() => {
      alert('push loaded')
      scroll.trigger('scroll.push.over')
    }, 2000)
  })
}, false)

