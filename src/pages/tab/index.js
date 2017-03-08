/**
 * Created by linxiaojie on 2017/2/7.
 */
import Tab from 'common/tab'
require('./index.less')
document.addEventListener('DOMContentLoaded', () => {
  let tab = new Tab({
    active: 0,
    init: () => {
      console.log('初始化')
    }
  })
  tab.on('tab.changed', (old, active, loaded) => {
    console.dir({
      old,
      active,
      loaded
    })
  })
  console.dir(tab)
})
