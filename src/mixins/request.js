import wepy from 'wepy'
import {
  objKeySort
} from './keySort'
import {
  encryptDES3
} from './des3'
import {
  hexMD5
} from './md5'

// const api = 'http://d7.cto.shovesoft.com/msyapp/'
// const uploadPath = 'http://d7.cto.shovesoft.com/msy_upload/file_upload/mobileImageUpload.do'


// d2第一期
const api = 'http://d2.cto.shovesoft.com/msyapp/'
const uploadPath = 'http://d2.cto.shovesoft.com/msy_upload/file_upload/mobileImageUpload.do'

/**
 * 
 * @param {*} url 接口地址
 * @param {*} data 附加数据
 * @param {*} resultType 是否直接返回结果
 * @param {*} method 请求方式
 */
async function request(url, data = {}, resultType = false, method = 'GET') {
  wepy.showLoading({
    title: '加载中…',
    mask: true
  })
  wepy.showNavigationBarLoading()
  // 补全接口地址
  if (url == '/upload') {
    url = uploadPath
  } else {
    url = api + url
  }
  // 对数据对象进行key值排序
  data = objKeySort(data);
  let mkey = '';
  // 对数据进行DES3加密并每60字符插入一个空格
  for (let key in data) {
    mkey += encryptDES3(data[key]).replace(/(.{60})/g, '$1 ');
  }
  // 对数据进行MD5加密
  mkey = hexMD5(mkey)
  // 添加签名
  data['mKey'] = mkey
  // 声明返回值变量
  let resultData = ''
  // 请求数据
  await wepy.request({
    url: url,
    method: method,
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }).then((res) => {
    // console.log(res)
    wepy.hideLoading()
    wepy.hideNavigationBarLoading()
    if (url == api + '/imageCode.do') {
      resultData = res
      return res
    }
    if (resultType) {
      resultData = res
      return res
    }
    if (res.data.type > 0 || res.data.flag == 1) {
      // 成功
      resultData = res.data.returnMap
    } else {
      // 失败
      // console.log(res)
      wepy.showToast({
        title: res.data.msg || "请求失败",
        icon: 'none'
      })
      resultData = false
    }

  }).catch((err) => {
    // 异常
    wepy.showToast({
      title: '请求接口异常',
      icon: 'none'
    })
  })
  return resultData
}

export {
  request
}