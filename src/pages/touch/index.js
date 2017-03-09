/**
 * Created by linxiaojie on 2017/1/3.
 */
import {tap, longTap} from 'common/touch'

/*
* tab事件
* */
tap('#timeout', function (evt) {
  alert('tap')
})
longTap('#timeout', function (evt) {
  alert('longTap')
})

