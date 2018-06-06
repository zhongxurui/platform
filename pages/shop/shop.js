// pages/shop/shop.js

const app = getApp();
const config = require('../../config.js');
const Md5 = require('../../MD5.js').hexMD5;

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;
        wx.request({
            url: config.getuserJF,
            data: {
                oppenid: app.globalData.openid,
                key: Md5(config.Md5key + app.globalData.openid),
            },
            success: (res) => {
                if (res.statusCode == 200) {
                    app.globalData.integral = res.data.integral;
                }
                self.setData({
                    integral: app.globalData.integral
                })
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

    },
    alert: function () {
        wx.showToast({
            title: '暂未开启分类',
            icon: "loading",
            mask: true,
        })
    },
    duih: function () {
        wx.showToast({
            title: '暂未开启',
            icon: "loading",
            mask: true,
        })
    },
    duihuan: function (e) {
        console.log(e)
        var self = this;
        var num = e.currentTarget.dataset.num;
        if (num) {
            if (num <= self.data.integral) {
                self.setData({
                    tips: true
                })
            } else {
                wx.showToast({
                    title: '积分不足',
                    icon: 'loading',
                    mask: true
                })
            }
        }
    },
    openTips: function (e) {
        var self = this;
        console.log(e.currentTarget.dataset.open);
        var state = e.currentTarget.dataset.open;
        var self = this;
        this.setData({
            tips: false
        })
    },
})