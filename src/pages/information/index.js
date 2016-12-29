/**
 * Created by linxiaojie on 2016/12/28.
 */
var loader = require('./loader.ejs')
console.log('is sss')
var $ = require('jquery')
$(function () {
  console.log('test hot relaod sfs')
  $(document.body).append(loader({title: '加载中'}))
})

