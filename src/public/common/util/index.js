/**
 * Created by linxiaojie on 2016/6/7.
 */
/*
 * 暴露其他库方法
 * */
/*
*  babel-preset-es2015 loose配置编译出来的代码不一致，会出来：Cannot assign to read only property ''__esmodule' of object '#object''
*  export * from ** 的形式会出现不一直的__esmodle代码：
*  Object.defineProperty
*  和 t.__esModule = true 共存报错
*  rel: http://www.tuicool.com/articles/zuIjqiB
*
* export * from './object'
 export * from './collection'
 export * from './string'
 export * from './date'
 export * from './tpl'
 export * from './url'
 export * from './dom'
 export * from './animate'
* */
import * as object from './object'
import * as collection from './collection'
import * as string from './string'
import * as date from './date'
import * as tpl from './tpl'
import * as url from './url'
import * as dom from './dom'
import * as animate from './animate'

var arrs = [object, collection, string, date, tpl, url, dom, animate]
var util = {}
collection.each(arrs, (obj) => {
  collection.each(obj, (fn, key) => {
    util[key] = fn
  })
})

export default util
