// pages/gameRank/gameRank.js
const app = getApp();
const config = require('../../config.js');
const Md5 = require('../../MD5.js').hexMD5;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        n: 0, ranklist:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log("option", options);
        if (!options.id) return;
        console.log(app.globalData.integral)
        var self = this;
        self.setData({
            userInfo: app.globalData.playerInfo,
            id: options.id,
            integral: app.globalData.integral,
            name: options.name
        }, () => {
            wx.showLoading({
                title: '前往排行榜中',
                mask: true
            })
            self.getRank(self.data.n);
        })
        wx.request({
            url: config.personalrank,
            data: {
                oppenid: app.globalData.openid,
                key: Md5(config.Md5key + app.globalData.openid),
                id: options.id,
            },
            success: res => {
                console.log("个人排行", res);
                if (res.data.score == 0) {
                  self.setData({
                    personalrank: "未上榜",
                    playerScore: res.data.score
                  })
                }else {
                  self.setData({
                    personalrank: res.data.personalrank,
                    playerScore: res.data.score
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

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
    onShareAppMessage: function () {
        var title = Math.floor(Math.random() * 2);
        return {
            title: config.shareArray[title],
            imageUrl: config.shareArrayImage[title],
            path: "/pages/index/index",
            success: res => {
                console.log(res)
            }
        }
    },
    RefreshList: function () {
        this.getRank("e");
    },
    getRank: function (e) {

        var self = this;
        var n = self.data.n;
        if (e) {
            n = self.data.n + 1;
            self.setData({
                n: n,
            })
        }
        wx.request({
            url: config.rank,
            data: {
                oppenid: app.globalData.openid,
                key: Md5(config.Md5key + app.globalData.openid),
                id: self.data.id,
                n: self.data.n
            },
            success: res => {
                console.log("res:,", res)
                self.setData({
                    ranklist: self.data.ranklist.concat(res.data)
                }, () => {
                    wx.hideLoading()
                })
            }
        })
    },
    gotohapply: function () {
        app.globalData.gotoleyuan = true;
        wx.switchTab({
            url: "../Getintegral/Getintegral"
        })
    },
})