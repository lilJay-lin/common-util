/**
 * Created by linxiaojie on 2017/1/22.
 */
import Promise from 'common/promise'
let should = require('chai').should()
describe("promise.js", () => {
  it.skip('new Promise', () => {
    var p = new Promise(function (resolve, reject) {
      return resolve(1)
    }).then((val) => {
        console.log('is resolve' + val)
        return val + 1
      }, (reason) => {
        console.log('is reject' + reason)
        return reason + 1
      })
    p.then((val) => {
      console.log('retry: is resolve' + val)
      return val + 1
    }, (reason) => {
      console.log('retry: is reject' + reason)
      return reason + 1
    })
  })
  it('new Promise()', function (done) {
    this.timeout(2000)
    var p = new Promise(function () {})
    setTimeout(function () {
      p.resolve(122)
    }, 1000)
    p.then((val) => {
      console.log('new Promise(): is resolve ' + val)
    }, (val) => {
      console.log('new Promise(): is reject ' + val)
    })
  })
  it.skip('Promise.all', function (done) {
    this.timeout(2000)
    Promise.all([new Promise(function (resolve, reject) {
      setTimeout(() => {
        resolve(1)
      }, 1000)
    }), new Promise(function (resolve, reject) {
      resolve(2)
    }), 2]).then((val) => {
      console.log('all is resolve:' + JSON.stringify(val))
      done()
    }, (val) => {
      console.log('some one is reject:' + val)
      done()
    })
  })
  it.skip('Promise.race', () => {
    this.timeout(2000)
    Promise.all([new Promise(function(resolve){
      setTimeout(() => {
        resolve(1)
      }, 1000)
    }), new Promise(function(resolve, reject){
      setTimeout(() => {
        reject(1)
      }, 500)
    }), 2]).then((val) => {
      console.log('race is resolve:' + JSON.stringify(val))
    }, (val) => {
      console.log('race is reject:' + val)
    })
  })
})