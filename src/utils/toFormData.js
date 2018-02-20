// request payload 转为 formData 传参
const toFormData = function (obj) {
  var str = []
  for (var p in obj) {
    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
  }
  return str.join('&')
}
export default toFormData
