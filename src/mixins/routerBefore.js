import wepy from 'wepy'

let firewall = [
  '../mallIndex/mallIndex'
]

let actionType = 1
/**
 * 页面跳转前拦截器
 *
 * @param {*} url 将要跳转的页面
 * @param {*} type 跳转的方式 1/2/3/4
 * @ 0 -- 0为checkFirewall方法自动判断赋值，跳转到登录页面
 * @ 1 -- 保留当前页面，跳转到应用内的某个页面 wx.navigateTo
 * @ 2 -- 关闭所有页面，打开到应用内的某个页面 wx.reLaunch
 * @ 3 -- 关闭当前页面，返回上一页面或多级页面 wx.navigateBack
 * @ 4 -- 关闭当前页面，打开到应用内的某个页面 wx.redirectTo
 * @param {*} userInfo 用户信息，用于验证是否登录
 */
function routerBefore(url, type, userInfo) {
  actionType = type
  checkFirewall(url, type, userInfo)
  switch (actionType) {
    case 0:
      LoginTo()
      break;
    case 1:
      navigateTo(url)
      break;
    case 2:
      reLaunch(url)
      break;
    case 3:
      navigateBack()
      break;
    case 4:
      redirectTo(url)
      break;
  }
}

function checkFirewall(url, type, userInfo) {
  for (let i in firewall) {
    let isBlack = url == firewall[i];
    if (isBlack) {
      actionType = userInfo != '' ? type : 0
    }
  }
}

// 跳转
function navigateTo(url) {
  wepy.navigateTo({
    url: url
  });
}

// 关闭所有并跳转
function reLaunch(url) {
  wepy.reLaunch({
    url: url
  });
}

// 返回
function navigateBack() {
  wepy.navigateBack();
}

// 关闭当前并跳转
function redirectTo(url) {
  wepy.redirectTo({
    url: url
  });
}

// 登录
async function LoginTo() {
  wepy.showToast({
    title: '请先登录！',
    icon: 'none'
  })
  await sleep(1.5) // 等待1.5s
  wepy.navigateTo({
    url: '../login/login'
  });
}

/**
 * 暂停线程
 *
 * @param {*} s 秒
 * @returns 无返回值
 */
function sleep(s) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('promise resolved');
    }, s * 1000);
  });
}

module.exports = routerBefore
