/**
 * Created by linxiaojie on 2017/1/3.
 */
import lazy from 'common/lazy'

document.addEventListener('DOMContentLoaded', () => {
  /*
  * mobile是否使用touchmove方式
  * */
  lazy({def: 'http://mmdm.aspire-tech.com/fx/demo/aoyun/img/img3.png', mobile: true})
}, false)

window.addEventListener('scrollEnd', () => {
  console.log('end')
})
