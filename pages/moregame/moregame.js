// pages/moregame/moregame.js
const app = getApp();
const config = require('../../config.js');
const Md5 = require('../../MD5.js').hexMD5;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showshare: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;
        self.setData({
            integral: app.globalData.integral
        })
        wx.request({
            url: config.getGameAll,
            data: {
                oppenid: app.globalData.openid,
                key: Md5(config.Md5key + app.globalData.openid),
            },
            success: (res) => {
                console.log("游戏： ",res)
                if (res.statusCode == 200) {
                    self.setData({
                        gameAll: res.data
                    })
                }
            }
        })
        wx.request({
            url: config.getTask,
            data: {
                oppenid: app.globalData.openid,
                key: Md5(config.Md5key + app.globalData.openid),
            },
            success: res => {
                console.log(res)
                if (res.statusCode == 200) {
                    self.setData({
                        TASK: res.data
                    })
                }
            }
        })

        // wx.request({
        //     url: config.updTask,
        //     data: {
        //         oppenid: app.globalData.openid,
        //         key: Md5(config.Md5key + app.globalData.openid),
        //         type: "type1",
        //         n: 2
        //     },
        //     success: (res) => {
        //         console.log(res)
        //     }
        // })
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            showshare: false
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
    formSubmit: function (e) {
      var self = this;

      switch (e.detail.target.dataset.type) {
        case "gotosign":
          self.gotosign();
          break;
        case "gotoleyuan":
          self.gotoleyuan();
          break;
        case "gotogame":
          self.gotogame(e.detail.target.dataset.item);
          break;
        // case "gotoshop":
        //   wx.navigateTo({
        //     url: '../shop/shop',
        //   })
        //   break;
      }

      app.dealFormIds(e.detail.formId);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (e) {
        var self = this;
        var title = Math.floor(Math.random() * 2);
        if (e.from == "button" && e.target.dataset.id != "1") {
            return {
                title: config.shareMoregame[title],
                imageUrl: config.shareMoregameImage[title],
                path: 'pages/index/index',
                complete: function (res) {
                    // 转发成功
                    let task = {
                        type: "type2",
                        n: 1
                    }
                    let callback = () => {
                        var TASK = "TASK.type2";
                        self.setData({
                            [TASK]: 1
                        })
                    }
                    app.setTask(task, callback);
                },
                fail: function (res) {
                    // 转发失败
                    wx.showToast({
                        title: '分享失败',
                        icon: "none"
                    })
                }
            }
        } else if (e.from == "button" && e.target.dataset.id == "1" ) {

            return {
                title: config.shareTiaozhan[title],
        
                imageUrl: config.shareTiaozhanImage[title],
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
        }
        
        else {
         
            return {
                title: config.shareArray[title],
                imageUrl: config.shareArrayImage[title],
                path: "/pages/index/index",
                success: res => {
                    console.log(res)
                }
            }
        }
    },
    gotoleyuan: function () {
        app.globalData.gotoleyuan = true;
        wx.switchTab({
            url: "../Getintegral/Getintegral"
        })
    },
    getmoregame: function () {
        wx.showToast({
            title: '没有更多游戏了呢亲~',
            icon: "none",
            mask: true
        })
    },
    gotogame: function (e) {
        var self = this;
        console.log(e)
        if (app.globalData.gameNum <= 0) {
            self.setData({
                showshare: true,
            })
            console.log(app.globalData.gameNum)
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
        if (e != "" && e!= null) {
            app.gotogame(e);
        } else {
            return;
        }
    },
    // gotosign: function () {
    //     wx.switchTab({
    //         url: "../Getintegral/Getintegral"
    //     })
    // },
    getgold: function (e) {
        var self = this;
        wx.showLoading({
            title: '领取中',
            mask: true
        })
        var gold = e.currentTarget.dataset.gold;
        var type = e.currentTarget.dataset.type;
        if (gold) {
            // return;
            wx.request({
                url: config.addGold,
                data: {
                    oppenid: app.globalData.openid,
                    key: Md5(config.Md5key + app.globalData.openid),
                    gold: gold
                },
                success: res => {
                    wx.request({
                        url: config.getuserJF,
                        data: {
                            oppenid: app.globalData.openid,
                            key: Md5(config.Md5key + app.globalData.openid),
                        },
                        success: (res) => {
                            app.globalData.integral = res.data.integral;
                            if (res.statusCode == 200) {
                                self.setData({
                                    integral: app.globalData.integral
                                })
                                let task = {
                                    type: type,
                                    n: 2
                                }
                                let callback = () => {
                                    var TASK = "TASK." + type;
                                    self.setData({
                                        [TASK]: 2
                                    })
                                    wx.hideLoading();
                                    wx.showToast({
                                        title: '领取成功',
                                        icon: "none",
                                        mask: true
                                    })
                                }
                                app.setTask(task, callback);
                                let info = {
                                    "name": "分享比游金币乐园给好友",
                                    "gold": 500

                                }
                                if (type == "type2") {
                                    // console.log(1111)
                                    app.detail(info);
                                }
                            }
                        }, fail: () => {
                            wx.hideLoading();
                            wx.showToast({
                                title: '领取失败，请重新领取',
                                icon: "none",
                                mask: true
                            })
                        }
                    })
                },
                fail: () => {
                    wx.hideLoading();
                    wx.showToast({
                        title: '领取失败，请重新领取',
                        icon: "none",
                        mask: true
                    })
                }
            })
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
                                            let callback = () => {
                                                var TASK = "TASK.type1";
                                                self.setData({
                                                    [TASK]: 2
                                                })
                                            }
                                            app.setTask(task, callback);
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
    hideshare: function () {
        this.setData({
            showshare: false
        })
    }
})