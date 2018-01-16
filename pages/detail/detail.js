
const AV = require('../../libs/av-weapp-min.js');
var BookList = AV.Object.extend('BookList');
Page({

  data: {
    tempFilePaths:'../images/blank_book.jpg',
    user:'',
    author:'',
    title:'',
    isbn:'',
    publisher:'',
    showLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var isbn = options.isbn;
    var title = options.title;
    var user = options.user;
    var author = options.author;
    var userQuery = new AV.Query(BookList);
    userQuery.equalTo('user', user);// 查询条件
    var authorQuery = new AV.Query(BookList);
    authorQuery.equalTo('author', author);// 查询条件
    var actionTypeQuery = new AV.Query(BookList); // 创建查询
    actionTypeQuery.lessThanOrEqualTo('actionType', 2);
    var titleQuery = new AV.Query(BookList);
    titleQuery.equalTo('name', title);// 查询条件
    var query = new AV.Query(BookList);
    console.log(author);
    if (author)
      query = AV.Query.and(titleQuery, actionTypeQuery, authorQuery);
    else
      query = AV.Query.and(userQuery,titleQuery, actionTypeQuery);
    query.descending('createdAt');
    query.first().then(function (data) { // 执行查询方法, then做异步处理
      if (!data)
        that.setData({
          title: 'error',
          showLoading: false
        });
      else {
        console.log(data.get('imageurl'));
        that.setData({
          author: data.get('author'),
          title: data.get('name'),
          isbn: data.get('ISBN'),
          publisher: data.get('publisher'),
          tempFilePaths: data.get('imageurl'),
          showLoading: false
        });
       }
      }, function (err) {
      console.log('error')
      // 处理错误
      }
    );  
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
  }
});