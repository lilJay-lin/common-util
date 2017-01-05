/**
 * Created by linxiaojie on 2017/1/3.
 */
import {leftPad} from './string.js'
/*
 * 获取时间字符串
 * */
export const getDate = () => {
  let date = new Date()
  return date.getFullYear() + '-' + leftPad((date.getMonth() + 1), 2) + '-' + leftPad(date.getDate(), 2)
}
export const getDateTime = (d) => {
  const date = d && d.constructor === d ? d : new Date()
  return getDate(date) + ' ' + leftPad(date.getHours(), 2) + ':' + leftPad(date.getMinutes(), 2)
}
