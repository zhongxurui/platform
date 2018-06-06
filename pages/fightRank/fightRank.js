// pages/fightRank/fightRank.js
const app = getApp();
const config = require('../../config.js');
const Md5 = require('../../MD5.js').hexMD5;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasme: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;
    
        wx.request({
            url: config.record,
            data: {
                oppenid: app.globalData.openid,
                key: Md5(config.Md5key + app.globalData.openid),
            },
            success: res => {
                console.log("zhanji: ",res)
                if (res.statusCode == 200) {
                    self.setData({
                        rank: res.data.rank,
                    })

                    if (res.data.myRank) {
                        self.setData({
                            hasme: true,
                            myRank: res.data.myRank,
                            myGold: res.data.myGold
                        })
                    }
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
    }
})