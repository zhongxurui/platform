// pages/index.js;
const app = getApp();
const config = require('../../config.js');
const Md5 = require('../../MD5.js').hexMD5;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ranklist: [],
        integral: 0,
        n: 0,
        "_toast_.text": "",
        hadshowaward: "hidden",
        show: " ",
        playerScore: 0,
        personalrank: 0,
        showQr: false,
        showshare: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;
        // console.log("lalal",app.globalData.channel_cai)
        if (app.globalData.channel_cai) {
            self.showTips();
        }
        wx.showShareMenu({
            withShareTicket: true
        })
        self.setData({
            marquee: {
                text: "恭喜用户10**" + sjNum() + "成功兑换" + sjAward() + "&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;" + "恭喜用户10**" + sjNum() + "成功兑换" + sjAward()
            }
        })
        var clear = setInterval(function () {
            self.setData({
                marquee: {
                    text: "恭喜用户10**" + sjNum() + "成功兑换" + sjAward() + "&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;" + "恭喜用户10**" + sjNum() + "成功兑换" + sjAward()
                }
            })
        }, 10000)
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

        let self = this;

        //设置用户信息 
        if (app.globalData.playerInfo) {
            if (app.show) {
                this.setData({
                    show: "true"
                })
            } else {
                this.setData({
                    show: "false"
                })
            }
            wx.request({
                url: config.getuserJF,
                data: {
                    oppenid: app.globalData.openid,
                    key: Md5(config.Md5key + app.globalData.openid),
                },
                success: (res) => {
                    //   console.log("lalal:", res);
                    app.globalData.integral = res.data.integral;
                    app.globalData.rem_gameNum = res.data.rem_gameNum;
                    app.globalData.gameNum = res.data.gameNum;
                    if (res.statusCode == 200) {
                        self.setData({
                            integral: app.globalData.integral,

                        })
                    }
                }
            })

            self.getGame();

        } else {
            app.playerInfoCallback = (res) => {
                if (app.show) {
                    this.setData({
                        show: "true"
                    })
                } else {
                    this.setData({
                        show: "false"
                    })
                }
                wx.request({
                    url: config.getuserJF,
                    data: {
                        oppenid: app.globalData.openid,
                        key: Md5(config.Md5key + app.globalData.openid),
                    },
                    success: (res) => {
                        // console.log(res);
                        if (res.statusCode == 200) {
                            app.globalData.integral = res.data.integral;
                            app.globalData.rem_gameNum = res.data.rem_gameNum;
                            app.globalData.gameNum = res.data.gameNum;
                            if (res.statusCode == 200) {
                                self.setData({
                                    integral: app.globalData.integral,
                                })
                            }
                        }
                    }
                })

                self.getGame();

            }
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // console.log(111)
        this.setData({
            hadshowaward: "hidden",
            n: 0,
            ranklist: [],
            showshare: false,
            hideTips: false
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.setData({
            n: 0,
            ranklist: [],
        })
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
        console.log(e)
        var title = Math.floor(Math.random() * 2);
        var self = this;
        if (e.from == "button" && e.target.dataset.id == "1") {
            return {
                title: config.shareTiaozhan[title],
                path: "/pages/index/index",
                imageUrl: config.shareTiaozhanImage[title],
                complete: res => {
                    console.log("转发：", res)
                    self.setData({
                        showshare: false
                    })
                    if (app.globalData.rem_gameNum < 3) {
                        wx.request({
                            url: config.gameNum,
                            data: {
                                type: 1,
                                n: 1,
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
        } else {
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
    RefreshList: function () {
        this.getRank("e");

    },
    RefreshList_top: function (e) {

    },





    getUserinfo: function (e) {
        var self = this;

        // if (app.globalData.rem_gameNum = null) return;
        if (e.detail.rawData) {
            if (app.globalData.rem_gameNum <= 0) {
                console.log(app.globalData.rem_gameNum)
                self.setData({
                    showshare: true
                })
                return
            }
            if (app.globalData.playerInfo.wxnicheng == "匿名用户" && app.globalData.playerInfo.portrait == "https://static-1255927411.cos.ap-beijing.myqcloud.com/image/gtlogo.jpg") {
                console.log("eeeeeeeeee");
                app.getUserInfo(e);
            }
            wx.navigateTo({
                url: '../h5game/h5game?address=' + self.data.address + "&openid=" + app.globalData.openid + "&id=" + self.data.id + "&key=" + Md5(config.Md5key + app.globalData.openid) + "&integral=" + self.data.jifen
            })
            self.onUnload();
            wx.request({
                url: config.gameNum,
                data: {
                    type: 1,
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
        } else {
            if (app.globalData.rem_gameNum <= 0) {
                self.setData({
                    showshare: true
                })
                return
            }
            wx.showModal({
                title: '提示',
                content: '您已经拒绝比游获取您的用户信息，您将以游客的身份继续体验',
                success: res => {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../h5game/h5game?address=' + self.data.address + "&integral=" + self.data.jifen + "&openid=" + app.globalData.openid + "&id=" + self.data.id + "&key=" + Md5(config.Md5key + app.globalData.openid)
                        })
                        self.onUnload();
                        wx.request({
                            url: config.gameNum,
                            data: {
                                type: 1,
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
                    } else {
                        return
                    }
                }
            })
        }

    },

    //获取游戏
    getGame: function () {

        var self = this;
        wx.request({
            url: config.getGame,
            data: {
                oppenid: app.globalData.openid,
                key: Md5(config.Md5key + app.globalData.openid),
            },
            success: (res) => {
                console.log("game: ", res)
                if (res.statusCode == 200 && res.data != "") {
                    self.setData({
                        address: res.data['appid'],
                        background: res.data['logo'],
                        id: res.data['id'],
                        jifen: res.data['integral']
                    }, function () {
                        console.log("lalal: ", self.data.jifen)
                        if (self.data.ranklist.length == 0) {
                            self.getRank();
                        }
                        wx.request({
                            url: config.personalrank,
                            data: {
                                id: self.data.id || 1,
                                oppenid: app.globalData.openid,
                                key: Md5(config.Md5key + app.globalData.openid),
                            },
                            success: (res) => {
                                console.log("个人排行： ", res)
                                if (res.statusCode == 200 && res.data) {
                                    if (res.data.score == 0) {
                                        self.setData({
                                            personalrank: "未上榜",
                                            playerScore: res.data.score
                                        })
                                    } else {
                                        self.setData({
                                            personalrank: res.data.personalrank,
                                            playerScore: res.data.score
                                        })
                                    }

                                }
                            }
                        })
                    })
                } else {
                    self.setData({
                        address: null,
                        background: "https://static-1255927411.cos.ap-beijing.myqcloud.com/gamePK/debug.png",
                        id: null,
                    }, function () {
                        self.hide();
                    })
                }
            }, fail: (res) => {
                wx.showModal({
                    title: '提示',
                    content: '服务器开小差了，重新进入游戏吧😢',
                })
            }
        })
    },
    getRank: function (e) {

        var self = this;
        var n = self.data.n;
        console.log(n)
        if (e) {
            n = self.data.n + 1;
            self.setData({
                n: n,
            })
        }
        wx.request({
            url: config.rank,
            data: {
                id: self.data.id || 1,
                oppenid: app.globalData.openid,
                key: Md5(config.Md5key + app.globalData.openid),
                n: n
            },
            success: (res) => {
                // console.log("a", res)
                if (res.statusCode == 200 && res.data) {
                    var rank = self.data.ranklist.concat(res.data)
                    self.setData({
                        ranklist: rank
                    }, function () {
                        self.hide();
                    })
                }
            }
        })

    },
    showaward: function () {
        this.setData({
            hadshowaward: "visible"
        })
    },
    hide: function () {
        if (this.data.show == "true") {
            wx.hideLoading();
            wx.showTabBar()
        } else {
            wx.hideLoading();
        }
    },


    clearAward: function () {
        this.setData({
            hadshowaward: "hidden"
        })
    },


    formSubmit: function (e) {
        var self = this;

        switch (e.detail.target.dataset.type) {
            case "gotohapply":
                self.gotohapply();
                break;
            case "clearAward":
                self.clearAward();
                break;
            case "showaward":
                self.showaward();
                break;
            case "gotoshop":
                wx.navigateTo({
                    url: '../shop/shop',
                })
                break;
        }

        app.dealFormIds(e.detail.formId);
    },

    //前往赚积分页面
    gotohapply: function () {
        app.globalData.gotoleyuan = true;
        wx.switchTab({
            url: "../Getintegral/Getintegral"
        })
    },
    gotomoregame: function () {
        wx.navigateTo({
            url: '../moregame/moregame',
        })
    },
    showQR: function () {
        wx.previewImage({
            current: 'http://static.bjpengkai.cn/gamePK/qrcode.jpg', // 当前显示图片的http链接
            urls: ['http://static.bjpengkai.cn/gamePK/qrcode.jpg'] // 需要预览的图片http链接列表
        })
    },
    hideshare: function () {
        this.setData({
            showshare: false
        })
    },
    gototest: function () {
        // wx.navigateToMiniProgram({
        //     appId: 'wx0b06ad9dced2df98'
        // })
        wx.navigateTo({
            url: '../test/test',
        })

    },
    hideTips: function () {
        this.setData({
            showTips: false
        })
    },
    showTips: function () {
        this.setData({
            showTips: true
        })
    },
    getUserinfo_new: function (e) {
        // console.log(e);
        var self = this;
        let encryptedData = e.detail.encryptedData;
        let iv = e.detail.iv;
        console.log(encryptedData, iv);
        if (iv && encryptedData) {
            wx.login({
                success: res => {

                    wx.request({
                        url: config.exchange,
                        data: {
                            oppenid: app.globalData.openid,
                            key: Md5(config.Md5key + app.globalData.openid),
                            code: res.code,
                            iv: iv,
                            encryptedData: encryptedData,
                            channel: '10001'
                        },
                        success: res => {
                            console.log(res);
                            if (res.statusCode == 200) {
                                self.hideTips();
                                wx.showToast({
                                    title: '兑换成功',
                                    icon: "success",
                                    mask: true
                                })
                            }
                        }
                    })
                }
            })
        }
    }
})

/**假的都是假的mmp */
function sjNum() {
    let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let yhId = "";
    for (let i = 0; i < 2; i++) {
        var items = array[Math.floor(Math.random() * array.length)];
        yhId = yhId + items;
    }
    return yhId;
}
function sjAward() {
    let array = ["USB风扇", "马克杯", "10Q币", "30元联通卡", "30元移动卡", "布朗熊", "佩奇手表", "10Q币", "10Q币", "10Q币", "10Q币"];
    let s = array[Math.floor(Math.random() * array.length)];
    return s;
}