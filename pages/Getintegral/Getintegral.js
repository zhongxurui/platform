// pages/Getintegral/Getintegral.js

const app = getApp();
const config = require('../../config.js');
const Md5 = require('../../MD5.js').hexMD5;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameAll: [],
    integral: 0,
    showsign: false,
    showkefu: false,
    showshare: false,
    wxmimin: [],
    showmimin: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.request({
      url: config.goods,
      data: {
        oppenid: app.globalData.openid,
        key: Md5(config.Md5key + app.globalData.openid),
      },
      success: res => {
        // console.log("good:", res);
        if (res.statusCode == 200) {
          self.setData({
            goods: res.data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    wx.request({
      url: config.othersGame,
      data: {
        oppenid: app.globalData.openid,
        key: Md5(config.Md5key + app.globalData.openid),
      },
      success: (res) => {
        // console.log(res)
        if (res.statusCode == 200) {
          res.data.forEach(x => {
            if (x.flag == 2) {
              self.data.wxmimin.push(x);
            }
          })
          self.setData({
            wxmimin: self.data.wxmimin
          }, function () {
            let showitem = self.data.wxmimin[Math.floor(Math.random() * self.data.wxmimin.length)];
            if (showitem) {
              self.setData({
                showmimin: showitem
              }, function () {
                // console.log(self.data.showmimin)
              });
            }
          })
        }
      }
    })
    // wx.request({
    //   url: config.othersGame,
    //   data: {
    //     oppenid: app.globalData.openid,
    //     key: Md5(config.Md5key + app.globalData.openid),
    //   },
    //   success: res => {
    //     console.log("othergame: ", res);
    //   }
    // })


    if (app.globalData.gotoleyuan) {
      this.setData({
        toView: "goldduihuan"
      }, () => {
        app.globalData.gotoleyuan = false;
      })
    } else {
      this.setData({
        toView: "top"
      }, () => {
        app.globalData.gotoleyuan = false;
      })
    }

    this.setData({
      integral: app.globalData.integral
    }, () => {
      wx.request({
        url: config.getuserJF,
        data: {
          oppenid: app.globalData.openid,
          key: Md5(config.Md5key + app.globalData.openid),
        },
        success: (res) => {
          if (res.statusCode == 200) {
            app.globalData.integral = res.data.integral;
            self.setData({
              integral: app.globalData.integral
            })
          }
        }
      })
    })

    wx.request({
      url: config.choiceGame,
      data: {
        oppenid: app.globalData.openid,
        key: Md5(config.Md5key + app.globalData.openid),
      },
      success: res => {
        // console.log("精选游戏： ", res);
        if (res.statusCode == 200) {
          self.setData({
            choiceGame: res.data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      showsign: false,
      showkefu: false,
      showshare: false,
      showmimin: null
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    // console.log(e)
    var self = this;
    var title = Math.floor(Math.random() * 2);
    if (e.from == "button") {
      return {
        title: "比游~",
        path: "/pages/index/index",
        complete: res => {
          self.setData({
            showshare: false
          })
          wx.request({
            url: config.gameNum,
            data: {
              type: 2,
              n: 10,
              oppenid: app.globalData.openid,
              key: Md5(config.Md5key + app.globalData.openid),
            }, success: res => {
              console.log("numL", res)
              if (res.statusCode == 200) {
                app.globalData.rem_gameNum = res.data.rem_gameNum;
                app.globalData.gameNum = res.data.gameNum;
              }
            }
          })
        }
      }
    } else {
      return {
        title: config.shareArray[title],
        imageUrl: config.shareArrayImage[title],
        path: "/pages/index/index",
        complete: res => {
          console.log(res)
        }
      }
    }
  },

  formSubmit: function (e) {
    // console.log(e)
    var goto = e.detail.target.dataset.type;
    var self = this;
    switch (goto) {
      case "gotosign":
        self.gotosign();
        break;
      case "gotomoregame":
        self.gotomoregame();
        break;
      case "duihuangood":
        self.duihuangood(e.detail.target.dataset.item)
        break;
      case "gotofight":
        self.gotofight();
        break;
    }
    app.dealFormIds(e.detail.formId);
  },


  gotomoregame: function () {
    wx.navigateTo({
      url: '../moregame/moregame',
    })
  },

  gotogame: function (e) {
    var self = this;
    // console.log(e)
    if (app.globalData.gameNum <= 0) {
      self.setData({
        showshare: true,
      })
      console.log(self.data.showshare)
      return;
    } else {
      wx.request({
        url: config.gameNum,
        data: {
          type: 2,
          n: -1,
          oppenid: app.globalData.openid,
          key: Md5(config.Md5key + app.globalData.openid),
        }, success: res => {
          console.log("numL", res)
          if (res.statusCode == 200) {
            app.globalData.rem_gameNum = res.data.rem_gameNum;
            app.globalData.gameNum = res.data.gameNum;
          }
        }
      })
    }
    if (e.currentTarget.dataset.item != "" && e.currentTarget.dataset.item != null) {
      app.gotogame(e.currentTarget.dataset.item);
    } else {
      return;
    }
  },
  gotofight: function () {
    wx.navigateTo({
      url: "../fightRank/fightRank",
    })
  },
  gotosign: function () {
    var self = this;
    wx.request({
      url: config.getSignIn,
      data: {
        oppenid: app.globalData.openid,
        key: Md5(config.Md5key + app.globalData.openid),
      },
      success: res => {
        if (res.statusCode == 200 && res.data !== "") {
          this.setData({
            showsign: true,
            sign: res.data.sign,
            signNum: res.data.signNum
          }, () => {
            self.showsignanimation();
          })
        }
      }
    })
  },
  signAward: function () {
    var self = this;
    wx.showLoading({
      title: '签到中。。',
      mask: true
    })
    wx.request({
      url: config.signIn,
      data: {
        oppenid: app.globalData.openid,
        key: Md5(config.Md5key + app.globalData.openid),

      },
      success: res => {
        if (res.statusCode == 200 && res.data !== "") {
          wx.request({
            url: config.addGold,
            data: {
              oppenid: app.globalData.openid,
              key: Md5(config.Md5key + app.globalData.openid),
              gold: config.signNum[self.data.signNum]
            },
            success: res => {
              if (res.statusCode == 200) {
                wx.request({
                  url: config.getuserJF,
                  data: {
                    oppenid: app.globalData.openid,
                    key: Md5(config.Md5key + app.globalData.openid),
                  },
                  success: res => {
                    if (res.statusCode == 200) {
                      wx.hideLoading();
                      wx.showToast({
                        title: '签到成功',
                      })
                      app.globalData.integral = res.data.integral;
                      self.setData({
                        integral: app.globalData.integral
                      })
                      self.hidesign();
                      let info = {
                        "name": "每日签到",
                        "gold": config.signNum[self.data.signNum]

                      }
                      app.detail(info);
                      let task = {
                        type: "type1",
                        n: 2
                      }
                      app.setTask(task);
                    }
                  }, fail: () => {
                    wx.hideLoading();
                    wx.showToast({
                      title: '签到失败，请重新签到',
                    })
                  }
                })
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: '签到失败，请重新签到',
                })
              }
            }, fail: () => {
              wx.hideLoading();
              wx.showToast({
                title: '签到失败，请重新签到',
              })
            }
          })

        }
      }, fail: () => {

        wx.hideLoading();
        wx.showToast({
          title: '签到失败，请重新签到',
        })
      }
    })
  },
  hidesign: function () {
    var self = this;
    this.setData({
      showsign: false
    }, () => {
      self.hidesignanimation();
    })
  },
  showsignanimation: function () {
    if (!this.sign) {
      var sign = wx.createAnimation({
        duration: 500,
        timingFunction: "linear",
      })
      this.sign = sign;
    }
    this.sign.opacity(1).step();
    this.setData({
      showsignanimation: this.sign.export()
    })
  },
  hidesignanimation: function () {
    if (!this.sign) {
      var sign = wx.createAnimation({
        duration: 500,
        timingFunction: "linear",
      })
      this.sign = sign;
    }
    this.sign.opacity(0).step();
    this.setData({
      showsignanimation: this.sign.export()
    })
  },
  hidekefu: function () {
    this.setData({
      showkefu: false
    })
  },
  duihuangood: function (e) {
    var self = this;
    if (e.sellOut == 0) {   ////[need todo]
      if (e.gold <= self.data.integral) {
        self.setData({
          showkefu: true
        })
      } else {
        wx.showToast({
          title: '金币不足哟亲~',
          icon: "none",
          mask: true
        })
      }
    } else {
      return;
    }
  },
  gotorank: function (e) {
    var self = this;
    console.log(e)
    if (e.currentTarget.dataset.item) {
      wx.navigateTo({
        url: '../gameRank/gameRank?id=' + e.currentTarget.dataset.item.id + "&name=" + e.currentTarget.dataset.item.name,
      })
    }
  },
  hideshare: function () {
    this.setData({
      showshare: false
    })
  },

  gotohezuo: function (e) {
    if (!e.currentTarget.dataset.appid) return;
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
      envVersion: 'release',
      success: res => {
        console.log(res)
      }
    })
  }
})
