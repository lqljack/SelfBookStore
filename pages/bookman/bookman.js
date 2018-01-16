var util = require('../../utils/util.js')
const AV = require('../../libs/av-weapp-min.js');
AV.init({
  appId: 'zqlO2VaUQ6jRSTlQTTcc6SSH-gzGzoHsz',
  appKey: '4ao421pk4jirBdEL56P4VNQx',
});
var BookList = AV.Object.extend('BookList');
// 声明类型
//actionType表示操作行为：1扫描加入，2手动新建，3删除，4清空，5同步行为
var startDateQuery = new AV.Query(BookList);
var count=0;
Page({
  data: {
    books:[],
    title:'',
    author:'',
    index:0,
    user:'',
    tempFilePaths:'',
    modalHidden: true,
    modalHiddenC: true,
    modalHiddenN: true,
    modalHiddenD: true
  },
  
//读取阶段接收前页数据
  onLoad: function (options) {
    var that=this;
    var title=options.title;
    var author=options.author;
    var isbn=options.isbn;
    var user = options.user;
    var tempFilePaths = options.tempFilePaths;
    console.log(tempFilePaths);
    var publisher = options.publisher;
    var books = [];
    var actionType = parseInt(options.actionType);
    var check = 0;
    var ifCorrect = options.ifCorrect;
    var bookList = new BookList();
    if (title == '') check = 1;
    try {
      var value = wx.getStorageSync('books')
      if (value) {
        // Do something with return value
        books = value;
        if (actionType==1 && value[0].name == title) {
          check = 1;
        }
      }
    } catch (e) {
      console.log("error in read store");
      // Do something when catch error
    };
    if (ifCorrect == 'true') 
      check = 2;
    console.log(check);
    if (check == 0 || check == 2 ){
        
        if (tempFilePaths!= '../images/blank_book.jpg'){
          if (isbn == 'null')
            var imagename = title + '.jpg';
          else
            var imagename = isbn + '.jpg';
          if (tempFilePaths.substr(0, 4) == 'http')
            bookList.set('imageurl', tempFilePaths);
          else{
            var file = new AV.File(imagename, {
              blob: {
                uri: tempFilePaths,
              },
            })

            file.save().then(function (file) {
              // 文件保存成功
              console.log(file.url());
              bookList.set('imageurl', file.url());
            }, function (error) {
            // 异常处理
              console.error(error);
            });
            bookList.set('image', file);
          }
        }   
        // 设置属性
        
        bookList.set('ISBN', isbn)
        bookList.set('name', title);
        bookList.set('author', author);
        bookList.set('user', user);
        bookList.set('actionType', actionType);
        bookList.set('publisher', publisher);
        console.log(bookList);
        bookList.save().then(function (booklist) {
          console.log('objectId is ' + booklist.id);
        }, function (error) {
          console.error(error);
        });
        var createtime=util.formatTime(new Date());
        if (check==0)
          books.splice(0, 0, { isbn: isbn, author: author, name: title, createtime: createtime });
        else{
          var index = parseInt(options.index);
          books[index].name = title;
          books[index].author = author;
          books[index].isbn = isbn;
          books[index].createtime=createtime;
        }
      // 新建对象
      }
    that.setData({
      books: books,
      user: user
    });
    wx.setStorageSync('books', this.data.books);
    console.log(that.data.books);
  },
  
  //返回首页
  back: function () {
      wx.navigateBack({
        delta: 1
      })
  },
  getout: function () {
    wx.navigateBack({
      delta: 2
    })
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

  //打开新建对话框
  modalShowN: function () {
    this.setData({
      modalHiddenN: !this.data.modalHiddenN,
    });
  },
  //向前增加一条数据
  add_before: function () {
    var books = this.data.books;
    //要增加的数组
    if (this.data.title || this.data.author) {//判断是否输入，若作者和书目都空输入，则不插入
      // 新建对象
      var bookList = new BookList();
      // 设置属性
      bookList.set('name', this.data.title);
      bookList.set('ISBN', 'null');
      bookList.set('author', this.data.author);
      bookList.set('user', this.data.user);
      bookList.set('actionType', 2);
      bookList.save().then(function (todo) {
        console.log('objectId is ' + todo.id);
      }, function (error) {
        console.error(error);
      });
      var newarray = [{
        author: this.data.author,
        name: this.data.title,
        isbn: 'null',
        createtime: util.formatTime(new Date())
      }];
      books = newarray.concat(books);
      this.setData({
        books: books
      });
    }
    this.setData({
    modalHiddenN: !this.data.modalHiddenN
    });
    wx.setStorageSync('books', this.data.books);
  },
  //取消新建对话框
  modalBindcancelN: function () {
    this.setData({
      modalHiddenN: !this.data.modalHiddenN
    })
  },
  
  //跳出修改数组对话框
  modalShow: function (e) {
    //这个参数“e”的具体作用，请参考微信小程序官方提供的说明，地址为https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/event.html?t=20161107
    var dataset = e.target.dataset;
    var Index = dataset.index; //在通过在wxml页面里使用 data-index="{{index}}"传递过来的，是为识别正在编辑修改哪个数组。
    //    console.log(Index);
    this.setData({
      index: Index,
      title: this.data.books[Index].name,
      author: this.data.books[Index].author,
      modalHidden: !this.data.modalHidden
    });
  },


  //修改数据
  editBindaconfirm: function () {
    var index = this.data.index;
    //    console.log(index);
    if (this.data.books[index].name != this.data.title || this.data.books[index].author != this.data.author){
      // 新建对象
      var bookList = new BookList();
      // 设置属性
      bookList.set('ISBN', this.data.books[index].isbn)
      bookList.set('name', this.data.books[index].name);
      bookList.set('author', this.data.books[index].author);
      bookList.set('user', this.data.user);
      bookList.set('actionType', 3);
      bookList.save().then(function (todo) {
        console.log('objectId is ' + todo.id);
      }, function (error) {
        console.error(error);
      });
      //我们要修改的数组
      this.data.books[index].name = this.data.title;
      this.data.books[index].author = this.data.author;
      
      //将合拼之后的数据，发送到视图层，即渲染页面
      // 新建对象
      var bookList = new BookList();
      // 设置属性
      bookList.set('ISBN', this.data.books[index].isbn)
      bookList.set('name', this.data.books[index].name);
      bookList.set('author', this.data.books[index].author);
      bookList.set('user', this.data.user);
      bookList.set('actionType', 2);
      bookList.save().then(function (todo) {
        console.log('objectId is ' + todo.id);
      }, function (error) {
        console.error(error);
      });
      this.setData({
        books: this.data.books
      });
    }
    this.setData({
      modalHidden: !this.data.modalHidden
    });
    wx.setStorageSync('books', this.data.books);
  },
  //取消修改对话框
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden
    })
  },

//打开清空对话框
  modalShowC: function () {
    this.setData({
      modalHiddenC: !this.data.modalHiddenC,
    });
  },
//清空
  clear: function () {
    // 新建对象
    var bookList = new BookList();
    bookList.set('actionType', 4);
    bookList.set('user', this.data.user);
    bookList.save().then(function (todo) {
      console.log('objectId is ' + todo.id);
    }, function (error) {
      console.error(error);
    });
    
    this.setData({
      books: [],
      modalHiddenC: !this.data.modalHiddenC
    });
  },
//取消清空对话框
  modalBindcancelC: function () {
    this.setData({
      modalHiddenC: !this.data.modalHiddenC
    })
  },

  //打开删除对话框
  modalShowD: function (e) {
    var dataset = e.target.dataset;
    var Index = dataset.index;
    this.setData({
      index: Index,
      modalHiddenD: !this.data.modalHiddenD,
    });
  },
  //删除
  remove: function () {
    var Index = this.data.index;
    // 新建对象
    var bookList = new BookList();
    // 设置属性
    bookList.set('ISBN', this.data.books[Index].isbn)
    bookList.set('name', this.data.books[Index].name);
    bookList.set('author', this.data.books[Index].author);
    bookList.set('user', this.data.user);
    bookList.set('actionType', 3);
    bookList.save().then(function (todo) {
      console.log('objectId is ' + todo.id);
    }, function (error) {
      console.error(error);
    });
    //通过`index`识别要删除第几条数据，第二个数据为要删除的项目数量，通常为1
    this.data.books.splice(Index, 1);
    //渲染数据
    this.setData({
      books: this.data.books,
      modalHiddenD: !this.data.modalHiddenD
    });
    wx.setStorageSync('books', this.data.books);
  },
  //取消删除对话框
  modalBindcancelD: function () {
    this.setData({
      modalHiddenD: !this.data.modalHiddenD
    })
  },

  resume: function () {
    var that=this;
    var books = this.data.books;
    var query = new AV.Query(BookList);
    var actionTypeQuery = new AV.Query(BookList); // 创建查询
    actionTypeQuery.lessThanOrEqualTo('actionType', 2); // 查询条件，查询 actionType 小于等于2 的 BookList
    var userQuery = new AV.Query(BookList);
    userQuery.equalTo('user', this.data.user);// 查询条件，查询 actionType 用户为当前 的 BookList

    var timeQuery = new AV.Query(BookList);
    timeQuery.equalTo('actionType', 4);// 查询条件，查询 actionType 用户为当前 的 BookList
    timeQuery.descending('createdAt');
    timeQuery.limit(3);// 最多返回 3 条结果
    timeQuery.find().then(function (results) { // 执行查询方法, then做异步处理
      if (results.length<2)
        var starttime = new Date('2016-12-03 00:00:00');
      else{
        var starttime = results[1].get('createdAt');
      }
      console.log(starttime);
      startDateQuery.greaterThanOrEqualTo('createdAt', starttime);// 查询条件，查询 上一次清空前 的 BookList
      count=1;
    }, function (err) {
      console.log('error')
      // 处理错误
    });
    
    query = AV.Query.and(actionTypeQuery, userQuery, startDateQuery);
    query.limit(10);// 最多返回 10 条结果
    query.ascending('createdAt');
    if (count==1){
      query.find().then(function (results) { // 执行查询方法, then做异步处理
        console.log(results);
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          var newarray = [{
            author: object.get('author'),
            name: object.get('name'),
            isbn: object.get('ISBN'),
            createtime: util.formatTime(object.get('createdAt')),
          }];
          books = newarray.concat(books);
          that.setData({
            books: books
          });
        }
      }, function (err) {
        console.log('error')
        // 处理错误
      })
      var bookList = new BookList();
      bookList.set('actionType', 5);
      bookList.set('user', this.data.user);
      bookList.save().then(function (todo) {
        console.log('objectId is ' + todo.id);
      }, function (error) {
        console.error(error);
      });
    }
  },

  
  tap2detail: function (e) {
    var dataset = e.target.dataset;
    var Index = dataset.index;
    var user = this.data.user;
    var isbn = this.data.books[Index].isbn;
    var title = this.data.books[Index].name;
    var author = this.data.books[Index].author;
    wx.navigateTo({
      url: '../detail/detail?title=' + title + '&' + 'author=' + author + '&' + 'isbn=' + isbn + '&' + 'user=' + user
    });
  },
  tap2Correct: function (e) {
    var dataset = e.target.dataset;
    var Index = dataset.index;
    var user = this.data.user;
    var isbn = this.data.books[Index].isbn;
    var title = this.data.books[Index].name;
    var author = this.data.books[Index].author;
    wx.redirectTo({
      url: '../bookManual/bookManual?title=' + title + '&' + 'author=' + author+ '&' + 'isbn=' + isbn + '&' + 'user=' + user + '&' + 'index=' + Index+ '&' + 'ifCorrect=true'
    });
  },
  onUnload:function() {
    wx.setStorageSync('books', this.data.books);
  }


})