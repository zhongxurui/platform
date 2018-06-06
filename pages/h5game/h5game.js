// pages/test/test.js

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
        if (options.openid) {
            this.setData({
                address: options.address + '?openid=' + options.openid + "&key=" + options.key + "&id=" + options.id + "&channel=byoo" + "&host=" + config.host + "&integral=" + options.integral
            })
        } else {
            this.setData({
                address: options.address
            })
        }

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
    msgHandler: function (e) {
        var source = new Array;
        for (let i in e.detail.data) {
            source.push(e.detail.data[i].source);
        }
        var max = source[0];
        for (var i = 1; i < source.length; i++) {
            if (max < source[i]) {
                max = source[i];
            }
        }
        console.log("soucre: ", max);
    }
})