Page({
  data: {
    scanResult: '',
    titleresult: '',
    author: '',
    aboutauthor:'',
    publisher:'',
    tempFilePaths:'',
    summary:'',
    isbn: '',
    user:'',
    showLoading: true,
    modalHidden: true,
    stars: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    normalSrc: '../images/normal.png',
    selectedSrc: '../images/selected.png',
    halfSrc: '../images/half.png',
    key: 0,//评分
  },
  onLoad: function (options) {
    this.setData({
      user:options.user
    });
    this.ScanDouban(options.scanResult);
    
  },

  ScanDouban: function (isbn) {
    var that = this;
    var newu = 'https://api.douban.com/v2/book/isbn/' + isbn;
    wx.request({
      url: newu,  //KEY和KEY值相同可简写为url
      data: {},
      header: { 'content-type': 'application/json' },
      method: 'GET',
      //成功时的回调，res为返回值，需要储存到我们的data数据里面
      success: function (res) {
        if (res.data.msg == "book_not_found")
          that.setData({
            scanResult: "无此书信息",
            isbn: isbn
          })
        else
          that.setData({
            key: res.data.rating.average,
            titleresult: res.data.title,
            author: res.data.author,
            aboutauthor:res.data.author_intro,
            summary: res.data.summary,
            publisher: res.data.publisher,
            tempFilePaths: res.data.image,
            isbn: isbn,
            scanResult:"成功"
          })
        
      },
      fail:function(){
        that.setData({
          scanResult: "无法连接",
          isbn: isbn
        })
      },
      complete: function () {
        that.cancelLoading();
        if (that.data.scanResult!="成功")
          that.setData({
            modalHidden: !that.data.modalHidden
          });
      }
    })
  },
  showLoading: function () {
    this.setData({
      showLoading: true
    })
  },
  cancelLoading: function () {
    this.setData({
      showLoading: false
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  Tap2Manual: function () {
    var user = this.data.user;
    var isbn = this.data.isbn;
    wx.navigateTo({
      url: '../bookManual/bookManual?user=' + user + '&' + 'isbn=' + isbn
    })
  },
  Tap2folder: function () {
    var that = this;
    var title = that.data.titleresult;
    var author = that.data.author;
    var isbn = that.data.isbn;
    var user = that.data.user;
    var publisher = that.data.publisher;
    var tempFilePaths = that.data.tempFilePaths;
    wx.navigateTo({
      url: '../bookman/bookman?title=' + title + '&' + 'author=' + author + '&' + 'isbn=' + isbn + '&' + 'user=' + user + '&' + 'publisher=' + publisher + '&' + 'tempFilePaths='+tempFilePaths+'&' + 'actionType=1'
    })
  },

})