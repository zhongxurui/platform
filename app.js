//app.js
const config = require('./config.js');
const Md5 = require('./MD5.js').hexMD5;

App({
    onLaunch: function (res) {
        //更新机制：
        if (typeof wx.getUpdateManager === 'function') {
            var userRequireUpdate = false;
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(res => {
                console.log("更新机制", res)
                if (res.hasUpdate) {
                    wx.showModal({
                        title: '提示',
                        content: '有新版本，是否更新？',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                userRequireUpdate = true
                            }
                        }
                    })
                }
            })
            updateManager.onUpdateReady(() => {
                // 新的版本下载成功
                if (userRequireUpdate) {
                    updateManager.applyUpdate();
                }
            })

            updateManager.onUpdateFailed(function () {
                // 新的版本下载失败
                if (userRequireUpdate) {
                    wx.showToast({
                        title: '新版本下载失败',
                        icon: "none",
                        mask: true
                    })
                }
            })
        }

        var channel = null;
        try {
            channel = res.referrerInfo.extraData['channel'];
            console.log("channel:", channel);
            if (channel == '10001') {
                this.globalData.channel_cai = true; //是从猜你妹进来的
            }
        } catch (e) {
            console.log("抛出异常");
        }


        var self = this;
        wx.hideTabBar();

        wx.showLoading({
            title: '努力加载中',
            mask: true,
        })
        wx.request({  ///添加判断接口
            url: config.host,
            success: z => {
                if (z.data == 0) {
                    self.show = true;
                } else {
                    self.show = false;
                }
                // let self = this;
                wx.getSystemInfo({ //获取设备信
                    success: function (res) {
                        if (res.platform) self.globalData.platform = res.platform;
                        ///处理音效兼容，发现某些用户微信版本过低，音乐播放会报错， 既然不兼容那么就不播放了，没必要为了音效让用户去提升版本，容易造成玩家流失
                        if (self.compareVersion(res.SDKVersion, '1.9.0') >= 0) self.globalData.SDK = true;
                        if (wx.canIUse('createInnerAudioContext') && self.compareVersion(res.SDKVersion, '1.9.0') >= 0) {
                        }
                    },
                })


                wx.login({
                    success: res => {
                        if (res.code) {
                            // 发送 res.code 到后台换取 openId, sessionKey, unionI
                            // console.log("wx.login.res  log", res.code);
                            self.globalData.code = res.code;
                            if (channel) {
                                wx.request({
                                    url: config.getuser,
                                    data: {
                                        code: self.globalData.code,
                                        key: Md5(config.Md5key + self.globalData.code),
                                        channel: channel
                                    },
                                    success: e => {
                                        if (e.statusCode == 200) {
                                            self.globalData.openid = e.data.oppenid;  //用户openidid

                                            if (e.data) {
                                                self.globalData.playerInfo = e.data;
                                                self.globalData.integral = e.data.integral;  //平台积分
                                                self.globalData.openid = e.data.oppenid;  //用户openidid
                                            }
                                            if (self.playerInfoCallback) {
                                                self.playerInfoCallback(self.globalData.playerInfo);   //获取个人信息
                                            }
                                        } else {
                                            wx.showModal({
                                                title: '提示',
                                                content: '登录平台失败，请退出小程序重新登录',
                                            })
                                        }
                                    }
                                })
                            } else {
                                wx.request({
                                    url: config.getuser,
                                    data: {
                                        code: self.globalData.code,
                                        key: Md5(config.Md5key + self.globalData.code),
                                    },
                                    success: e => {
                                        if (e.statusCode == 200) {
                                            self.globalData.openid = e.data.oppenid;  //用户openidid

                                            if (e.data) {
                                                self.globalData.playerInfo = e.data;
                                                self.globalData.integral = e.data.integral;  //平台积分
                                                self.globalData.openid = e.data.oppenid;  //用户openidid
                                            }
                                            if (self.playerInfoCallback) {
                                                self.playerInfoCallback(self.globalData.playerInfo);   //获取个人信息
                                            }
                                        } else {
                                            wx.showModal({
                                                title: '提示',
                                                content: '登录平台失败，请退出小程序重新登录',
                                            })
                                        }
                                    }
                                })
                            }
                        }
                        // this.getSetting();
                    }
                })
                //微信小程序保持长亮
                wx.setKeepScreenOn({
                    keepScreenOn: true,
                })
            },
            fail: res => {
                // console.log("ll")
            }
        })
    },

    //获取微信用户信息 
    getUserInfo: function (e, callback) {
        console.log(e);
        var self = this;
        if (e.detail.rawData) {
            var res = e.detail;
            var userinfo = JSON.parse(res.rawData)
            // console.log(res, userinfo);
            wx.login({
                success: l => {
                    console.log(l)
                    wx.request({
                        url: config.serUser,
                        data: {
                            code: l.code,
                            key: Md5(config.Md5key + l.code),
                            portrait: userinfo.avatarUrl || null,
                            wxnicheng: userinfo.nickName || null,
                            encryptedData: res.encryptedData || null,
                            iv: res.iv || null
                        },
                        success: res => {
                            console.log(res);
                            if (res.statusCode == 200) {
                                // console.log("lala")
                                self.globalData.playerInfo = res;
                                if (callback && typeof callback == "function") {
                                    callback();
                                }
                            }
                        }
                    })
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '您已经拒绝比游获取您的用户信息，您将继续以游客的身份继续体验',
                showCancel: false
            })
        }
    },
    //获取formId存储起来， 用于获取程序发送推送消息时的foremID；
    dealFormIds: function (formId) {
        let self = this;
        let formIds = this.globalData.gloabalFomIds;
        if (!formIds) formIds = [];
        let data = {
            formId: formId,
        }
        formIds.push(data);
        self.globalData.gloabalFomIds = formIds;
        if (this.globalData.gloabalFomIds.length > 4) {
            wx.request({
                url: config.formId,
                data: {
                    oppenid: self.globalData.openid,
                    key: Md5(config.Md5key + self.globalData.openid),   // md5加密
                    formID: self.globalData.gloabalFomIds
                },
                success: (res) => {
                    console.log("1111111", res); self.globalData.gloabalFomIds = "";
                }
            })
        }
    },
    onShow: function (e) {
        console.log("渠道码", e);
        // if (e.referrerInfo) {
        //   if (e.referrerInfo.extraData['channel']) {
        //     console.log(e.referrerInfo.extraData['channel'])
        //   }
        // }
    },

    gotogame: function (e) {
        wx.showLoading({
            title: '正在前往中...',
            mask: true
        })
        var self = this;
        // console.log(e);
        if (e['appId'] && e['id']) {
            let appid = e['appId'];
            let id = e['id'];
            let address = e['address'];
            let integral = e['integral'];
            let openid = self.globalData.openid;
            let key = Md5(config.Md5key + self.globalData.openid);
            let game = "biyou";
            if (id) {
                wx.request({
                    url: config.peopleNum,
                    data: {
                        oppenid: self.globalData.openid,
                        key: Md5(config.Md5key + self.globalData.openid),   // md5加密
                        id: id
                    },
                })
            }
            if (isURL(appid) && (address == "" || address == null)) {
                wx.navigateTo({
                    url: '../h5game/h5game?address=' + appid + "&integral=" + integral + "&id=" + id + "&openid=" + self.globalData.openid + "&key=" + Md5(config.Md5key + self.globalData.openid),
                    success: () => {
                        wx.hideLoading();
                    }
                })
            } else {
                // go to mini wechat
                wx.navigateToMiniProgram({
                    appId: appid,
                    extraData: {
                        "openid": openid,
                        "key": key,
                        "game": game,
                        "id": id
                    },
                    envVersion: 'release',
                    success: () => {
                        wx.hideLoading();
                    }
                })
            }
        }
    },

    detail: function (e) {
        var self = this;
        if (!e) return;
        wx.request({
            url: config.detail,
            data: {
                oppenid: self.globalData.openid,
                key: Md5(config.Md5key + self.globalData.openid),   // md5加密
                type: e.name,
                gold: e.gold
            }
        })
    },
    setTask: function (e, callback) {
        var self = this;


        wx.request({
            url: config.getTask,
            data: {
                oppenid: self.globalData.openid,
                key: Md5(config.Md5key + self.globalData.openid),
            },
            success: res => {
                wx.request({
                    url: config.updTask,
                    data: {
                        oppenid: self.globalData.openid,
                        key: Md5(config.Md5key + self.globalData.openid),
                        type: e.type,
                        n: e.n
                    },
                    success: (res) => {
                        console.log("lala:", res);
                        if (callback) {
                            callback();
                        }
                    }
                })
            }
        })

    },

    //小程序初始化之后的本地数据
    globalData: {
        openid: null, //用户openid  
    },
    compareVersion: function (v1, v2) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        var len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }
        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i])
            var num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }
        return 0
    }
})
function isURL(str_url) {// 验证url  
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@  
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184  
        + "|" // 允许IP和DOMAIN（域名）  
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名  
        + "[a-z]{2,6})" // first level domain- .com or .museum  
        + "(:[0-9]{1,4})?" // 端口- :80  
        + "((/?)|" // a slash isn't required if there is no file name  
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    return re.test(str_url);
} 
