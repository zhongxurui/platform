// pages/test/test.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        number1: 0,
        number2: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.setNumber();
    },

    setNumber: function () {
        let number1 = MathNumber();
        let number2 = MathNumber();
        if (number1 == number2) {
            this.setData({
                number1: number1 + 1,
                number2: number2
            })
        } else {
            this.setData({
                number1: number1,
                number2: number2
            })
        }
    },
    getQuestion: function (e) {
        let index = e.currentTarget.dataset.index;
       
        if (index == 1) { 
            this.data.number1 > this.data.number2 ? this.chooseTrue() : this.chooseFalse();
        } else {
            this.data.number1 < this.data.number2 ? this.chooseTrue() : this.chooseFalse();
        }
    },
    chooseTrue: function () {
        var self = this;
        wx.showModal({
            content: '恭喜你答对了',
            showCancel: false,
            confirmText: "下一题",
            success: res => {
                if (res.confirm) {
                    self.setNumber();
                }
            }

        })
    },
    chooseFalse: function () {
        wx.showToast({
            title: '不对哦，再想想！',
            icon: "none",
            mask: true
        })
    }
})


function MathNumber() {
    var number = Math.floor(Math.random() * 100);
    return number;
}