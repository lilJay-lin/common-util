/**
 * Created by linxiaojie on 2017/1/4.
 */
import {property} from './object'
const R_PAD = 'r_pad'
const L_PAD = 'l_pad'
/*
 * 补充字符串到指定长度
 * */
const getLength = property('length')
function repeat (type, str, len, pad) {
  var l = getLength(str + '')
  if (l > len) {
    return str
  }
  var pads = repeatPad(pad, len - l + 1)
  return type === R_PAD ? str + pads : pads + str
}
function repeatPad (pad, len) {
  var o = '0'
  if (pad) {
    o = pad
  }
  return new Array(len).join(o)
}
export const leftPad = (str, len, pad) => {
  return repeat(L_PAD, str, len, pad)
}
export const rightPad = (str, len, pad) => {
  return repeat(R_PAD, str, len, pad)
}
