/**
 * Created by linxiaojie on 2017/1/3.
 */
import lazy from 'common/lazy'
import Tab from 'common/tab'
require('../tab/index.less')

document.addEventListener('DOMContentLoaded', () => {
  let tab = new Tab({init: () => {
  }})
  tab.on('tab.changed', (old, active, loaded) => {
    console.log(loaded)
    if (!loaded) {
      /*
       * mobile是否使用touchmove方式
       * */
      lazy({container: '#child2', def: 'http://mmdm.aspire-tech.com/fx/demo/aoyun/img/img3.png'})
    }
  })
  /*
   * mobile是否使用touchmove方式
   * */
  lazy({container: '#child', def: 'http://mmdm.aspire-tech.com/fx/demo/aoyun/img/img3.png'})
}, false)

window.addEventListener('scrollEnd', () => {
  console.log('end')
})
