//index.js
const AV = require('../../libs/av-weapp-min.js');
var BookList = AV.Object.extend('BookList');
//获取应用实例
Page({
  data: {
    title:'',
    author:'',
    publisher:'',
    isbn:'',
    user:'',
    index:0,
    showLoading:true,
    ifCorrect:"false",
    tempFilePaths: '../images/blank_book.jpg'
  },
  //事件处理函数
  onLoad: function (options) {
    //调用应用实例的方法获取全局数据
    var that = this;
    var isbn = options.isbn;
    var user = options.user;
    var ifCorrect=options.ifCorrect;
    if (ifCorrect=='true'){//修改
      var title = options.title;
      var author = options.author;
      var index = parseInt(options.index);
      var userQuery = new AV.Query(BookList);
      userQuery.equalTo('user', user);// 查询条件
      var authorQuery = new AV.Query(BookList);
      authorQuery.equalTo('author', author);// 查询条件
      var actionTypeQuery = new AV.Query(BookList); // 创建查询
      actionTypeQuery.lessThanOrEqualTo('actionType', 2);
      var titleQuery = new AV.Query(BookList);
      titleQuery.equalTo('name', title);// 查询条件
      var query = new AV.Query(BookList);
      if (author)
        query = AV.Query.and(titleQuery, actionTypeQuery, authorQuery);
      else
        query = AV.Query.and(userQuery, titleQuery, actionTypeQuery);
      query.descending('createdAt');
      query.first().then(function (data) { // 执行查询方法, then做异步处理
        if (!data)
          that.setData({
            showLoading: false
          });
        else {
          console.log(data)
          that.setData({
            author: (data.get('author')==undefined) ? "" : data.get('author'),
            title: data.get('name'),
            isbn: data.get('ISBN'),
            publisher: (data.get('publisher') == undefined) ? "" : data.get('publisher'),
            tempFilePaths: data.get('imageurl'),
            index:index,
            showLoading: false
          });
        }
      }, function (err) {
        console.log('error')
        // 处理错误
      }
      ); 
    }
    else
      this.setData({
        isbn: isbn,
      });
    this.setData({
      user: user,
      ifCorrect: ifCorrect,
    });
  },
  //监听对话框输入
  titleInputEvent: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  authorInputEvent: function (e) {
    this.setData({
      author: e.detail.value
    })
  },
  publisherInputEvent: function (e) {
    this.setData({
      publisher: e.detail.value
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 2
    })
  },
  Tap2folder: function () {
    var that = this;
    var title = that.data.title;
    var author = that.data.author;
    var isbn = that.data.isbn;
    var user = that.data.user;
    var publisher = that.data.publisher;
    var tempFilePaths = that.data.tempFilePaths;
    var ifCorrect = that.data.ifCorrect;
    var index = that.data.index;
    wx.redirectTo({
      url: '../bookman/bookman?title=' + title + '&' + 'author=' + author + '&' + 'isbn=' + isbn + '&' + 'publisher=' + publisher + '&' + 'user=' + user + '&' + 'tempFilePaths=' + tempFilePaths + '&' + 'index=' + index + '&' + 'ifCorrect=' + ifCorrect + '&' + 'actionType=2'
    })
  },
  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          tempFilePaths: res.tempFilePaths[0]
        })
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
    var user=this.data.user;
    if (this.data.ifCorrect=="true"){
      wx.redirectTo({
        url: '../bookman/bookman?title='+''+ '&' + 'user=' + user
      });
    }else
      wx.navigateBack({
        delta: 1
      })
  }
})