/**
 * Created by linxiaojie on 2017/2/7.
 */
import Tab from 'common/tab'
require('./index.less')
document.addEventListener('DOMContentLoaded', () => {
  let tab = new Tab({})
  tab.on('tab.changed', (old, active, loaded) => {
    console.dir({
      old,
      active,
      loaded
    })
  })
  console.dir(tab)
})
