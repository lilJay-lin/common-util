/**
 * Created by linxiaojie on 2017/1/3.
 */
import Timeout from 'common/timeout'

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
