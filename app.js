//app.js
App({
  onLaunch: function () {//监听初始化
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorageSync('first_enter', true)
    var that=this
    //调用API从本地缓存中获取数据
    let curid=wx.getStorageSync('curid') || that.curid;//API：获取本地缓存，若不存在设置为全局属性
    //调用全局方法,设置本地存储
    that.setLocal('curid',that.curid)
  },
  //如下为自定义的全局方法和全局变量
  //自定义全局方法
  setLocal(id,val){
    wx.setStorageSync(id, val);//设置本地存储
  },
  //自定义全局属性
  curid: "CN101010100",
  globalData: {
    userInfo: null
  }
})