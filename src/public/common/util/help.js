/**
 * Created by linxiaojie on 2017/1/19.
 */
export function assert (condition, msg) {
  if (!condition) throw new Error(`${msg}`)
}

export const requestAnimationFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 1000 / 60)
    }
})()

export const cancelAnimationFrame = (function () {
  return window.cancelRequestAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    function (timeout) {
      timeout && window.clearTimeout(timeout)
    }
})()
