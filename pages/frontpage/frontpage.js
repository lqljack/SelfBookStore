//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo:{},
    starticon: '../images/eye.jpg'
  },
  //事件处理函数
  
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    })
  },
  ScanWxImage: function () {
    var that = this;
    wx.scanCode({
      success: function (res) {
        console.log(res);
        wx.navigateTo({
          url: '../bookResult/bookResult?scanResult=' + res.result + '&' + 'user=' + that.data.userInfo.nickName
        })
      }
    })
  },
  Tap2folder: function () {
    var user = this.data.userInfo.nickName;
    wx.navigateTo({
      url: '../bookman/bookman?title=' + '' +'&' + 'user=' + user
    })
  },
  Tap2Manual: function () {
    var user = this.data.userInfo.nickName;
    var isbn = 'null';
    wx.navigateTo({
      url: '../bookManual/bookManual?user=' + user + '&' + 'isbn=' + isbn + '&' + 'ifCorrect=false'
    })
  },
})
