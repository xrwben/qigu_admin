// 用户类型
const accountType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '超级管理员'
      break
    case 2:
      result = '管理员'
      break
    default:
      break
  }
  return result
}

// 日志类型
const logType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '股权管理'
      break
    case 2:
      result = '公司管理'
      break
    case 3:
      result = '订单及购买'
      break
    default:
      break
  }
  return result
}

// 证件类型
const idCardType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '身份证'
      break
    case 2:
      result = '护照'
      break
    case 3:
      result = '台胞证'
      break
    case 4:
      result = '回乡证'
      break
    default:
      break
  }
  return result
}

// 企业类型
const companyType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '有限责任公司'
      break
    case 2:
      result = '股份有限公司'
      break
    default:
      break
  }
  return result
}

// 问题类型
const issueType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '功能介绍'
      break
    case 2:
      result = '常见问题'
      break
    case 3:
      result = '普通问题'
      break
    default:
      break
  }
  return result
}

// 问题类型
const couponState = function (value) {
  var result
  switch (value) {
    case 1:
      result = '未使用'
      break
    case 2:
      result = '已使用'
      break
    case 3:
      result = '已过期'
      break
    default:
      break
  }
  return result
}

// 完成状态
const state = function (value) {
  var result
  switch (value) {
    case 1:
      result = '未完成'
      break
    case 2:
      result = '已完成'
      break
    default:
      break
  }
  return result
}

// 企业认证状态
const authenticationState = function (value) {
  var result
  switch (value) {
    case 1:
      result = '未认证'
      break
    case 2:
      result = '认证中'
      break
    case 3:
      result = '已通过'
      break
    case 4:
      result = '已驳回'
      break
    default:
      break
  }
  return result
}

// 员工认证状态
const empAuthenticationState = function (value) {
  var result
  switch (value) {
    case 1:
      result = '未激活'
      break
    case 2:
      result = '未认证'
      break
    case 3:
      result = '认证中'
      break
    case 4:
      result = '已通过'
      break
    case 5:
      result = '已驳回'
      break
    default:
      break
  }
  return result
}

// 订单状态
const orderStatus = function (value) {
  var result
  switch (value) {
    case 1:
      result = '待支付'
      break
    case 2:
      result = '已支付'
      break
    case 3:
      result = '已取消'
      break
    default:
      break
  }
  return result
}

// 使用场景
const sceneType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '新建激励计划-决议文件'
      break
    case 2:
      result = '个人-有限'
      break
    case 3:
      result = '个人-股份'
      break
    case 4:
      result = '平台-有限'
      break
    case 5:
      result = '平台-股份'
      break
    case 6:
      result = '授予-个人持股'
      break
    case 7:
      result = '授予-持股平台'
      break
    case 8:
      result = '转换'
      break
    case 9:
      result = '计划预览-体验'
      break
    case 10:
      result = '分红股-打印'
      break
    case 11:
      result = '受限股-打印'
      break
    case 12:
      result = '激励对象批量导入'
      break
    default:
      break
  }
  return result
}

// 持股主体
const positionsMainType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '个人持股'
      break
    case 2:
      result = '持股平台'
      break
    default:
      break
  }
  return result
}

// 分红股状态
const stockStatus = function (value) {
  var result
  switch (value) {
    case 1:
      result = '待签字'
      break
    case 2:
      result = '已签字'
      break
    case 3:
      result = '转换中'
      break
    case 4:
      result = '转换完成'
      break
    default:
      break
  }
  return result
}

// 时间单位
const timeUnit = function (value) {
  var result
  switch (value) {
    case 1:
      result = '年'
      break
    case 2:
      result = '月'
      break
    case 3:
      result = '日'
      break
    default:
      break
  }
  return result
}

// 时间格式
const dateFormat = function (value) {
  if (value) {
    let year = new Date(value).getFullYear() || 0
    let month = (new Date(value).getMonth() + 1 || 0) < 10 ? '0' + (new Date(value).getMonth() + 1 || 0) : (new Date(value).getMonth() + 1 || 0)
    let date = (new Date(value).getDate() || 0) < 10 ? '0' + (new Date(value).getDate() || 0) : (new Date(value).getDate() || 0)
    // let hour = (new Date(value).getHours() || 0) < 10 ? '0' + (new Date(value).getHours() || 0) : (new Date(value).getHours() || 0)
    // let minute = (new Date(value).getMinutes() || 0) < 10 ? '0' + (new Date(value).getMinutes() || 0) : (new Date(value).getMinutes() || 0)
    // let second = (new Date(value).getSeconds() || 0) < 10 ? '0' + (new Date(value).getSeconds() || 0) : (new Date(value).getSeconds() || 0)
    // return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    return year + '-' + month + '-' + date
  } else {
    return '--'
  }
}

export {accountType, logType, dateFormat, idCardType, companyType, issueType, couponState, state, authenticationState, orderStatus, sceneType, empAuthenticationState, positionsMainType, stockStatus, timeUnit}
