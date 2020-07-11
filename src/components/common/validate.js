const flagNum = (rule, value, callback) => {
  if (value.length > 10) {
    callback(new Error('标签不能超过10个字符'))
  } else {
    callback()
  }
}
// 产品价格
const proPrice = (rule, value, callback) => {
  const reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('格式不正确'))
  }
}
// 购买数量
const checkNum = (rule, value, callback) => {
  const reg = /^\+?[1-9][0-9]*$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('数量必须为正整数'))
  }
}
// 产品链接
const checkLink = (rule, value, callback) => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('链接格式不正确'))
  }
}
// 手机号
const validatePhone = (rule, value, callback) => {
  const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号'))
  }
}
export default {
  flagNum, proPrice, checkNum, checkLink, validatePhone
}
