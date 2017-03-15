/**
 * Created by linxiaojie on 2017/3/14.
 */
const DOMAIN = window.location.hostname
/*
* @param {string} name
* @param {string|number} value
* @param {object} options
* */
export const setCookie = (name, value, {expires = 30, domain = DOMAIN, path = '/', secure = false}) => {
  let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value)
  let exp = new Date()
  if (expires instanceof Date) {
    exp = expires
  } else {
    exp.setTime(exp.getTime() + (parseInt(expires, 10) || 0) * 24 * 60 * 60 * 1000)
  }
  cookieText += ';expires=' + exp.toGMTString() + ';path=' + path
  if (secure) {
    cookieText += ';secure'
  }
  document.cookie = cookieText
}

/*
* @param {string} name
* @return {null|string|number}
* */
export const getCookie = (name) => {
  let reg = new RegExp('(^|)' + encodeURIComponent(name) + '=([^;]*)(;|$)')
  let group = reg.exec(document.cookie)
  return group ? decodeURIComponent(group[2]) : null
}

/*
 * @param {string} name
 * */
export const removeCookie = (name) => {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let value = getCookie(name)
  value && setCookie(name, value, {expires: exp})
}
