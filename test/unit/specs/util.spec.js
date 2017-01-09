/**
 * Created by linxiaojie on 2017/1/3.
 */
let should = require('chai').should()

describe ("util.js", () => {
  describe("#string.js", () => {
    let string = require('common/util/string')
    it('leftPad', () => {
      let time = '1'
      let pad = '0'
      let nTime = string.leftPad(time, 2, pad)
      nTime.should.be.equals(pad + time)
    })
    it('rightPad', () => {
      let time = '1'
      let pad = '0'
      let nTime = string.rightPad(time, 2, pad)
      nTime.should.be.equals(time + pad)
    })
  })
})
