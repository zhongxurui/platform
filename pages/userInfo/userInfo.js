// pages/userInfo/userInfo.js
const app = getApp();
const config = require('../../config.js');
const Md5 = require('../../MD5.js').hexMD5;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        n: 0,
        detail: [],
        gold: 0,
        accumulativeGold: 0,
        profits: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;
        this.setData({
            userInfo: app.globalData.playerInfo
        })
        var id = app.globalData.playerInfo.id.toString();
        var new_id = "1";
        var step = 5 - id.length;
        if (id.length < 5) {
            for (let index = 0; index < step; index++) {
                new_id = new_id + "0"
            }
            id = new_id + id
        }
        this.setData({
            idid: id
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
        self.detailadd(self.data.n);
        wx.request({
            url: config.getData,
            data: {
                oppenid: app.globalData.openid,
                key: Md5(config.Md5key + app.globalData.openid),
            },
            success: (e) => {
                console.log(e)
                if (e.statusCode == 200) {
                    self.setData({
                        gold: e.data.gold,
                        accumulativeGold: e.data.accumulativeGold
                    })
                    if (e.data.profits != null) {
                        self.setData({
                            profits: e.data.profits
                        })
                    } 
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            detail: [],
            n: 0,
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
    getuserinfo: function (e) {
        var self = this;
        if (e.detail) {
            app.getUserInfo(e);
        }
    },
    getUserinfo: function (e) {
        let callback = () => {
            wx.showToast({
                title: '更新成功',
            })
        }
        app.getUserInfo(e, callback);
    },
    detailadd: function (n) {
        var self = this;
        wx.request({
            url: config.getDetail,
            data: {
                oppenid: app.globalData.openid,
                key: Md5(config.Md5key + app.globalData.openid),
                n: n
            },
            success: res => {
                
                if (res.statusCode == 200) {
                    self.setData({
                        detail: self.data.detail.concat(res.data)
                    }, () => {
                        if (res.data.length > 0) {
                            self.setData({
                                n: self.data.n + 1
                            })
                        } else {
                            wx.showToast({
                                title: '没有更多明细了奥~',
                                icon: "none",
                                mask: true
                            })
                        }
                    })
                }
            }
        })
    },
    getmoredetail: function () {
        this.detailadd(this.data.n + 1);
    }
})