/**
 * Created by linxiaojie on 2017/1/19.
 */
export function assert (condition, msg) {
  if (!condition) throw new Error(`${msg}`)
}