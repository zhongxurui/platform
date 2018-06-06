/**
 * 小程序配置文件
 */
// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

const Md5key = "tkq:B5Y_mBl9:l/9";  //Md5加密key

// const host = 'https://test.bjpengkai.cn/'; //测试域名；

const host = 'https://game.bjpengkai.cn/';//正式域名

const shareArray = ['整个朋友圈都在玩，根本停不下来!','狂撒金币，最高可兑换iPhone X，快来试试！'];
const shareArrayImage = ['http://static.bjpengkai.cn/gamePK/shareImage/1.jpg','http://static.bjpengkai.cn/gamePK/shareImage/2.jpg']

const shareTiaozhan = ['众多礼品等你领，快来搞事情','用金币换百元大钞，这操作666啊'];
const shareTiaozhanImage = ['http://static.bjpengkai.cn/gamePK/shareImage/3.jpg','http://static.bjpengkai.cn/gamePK/shareImage/4.jpg']
const shareMoregame = ['我离小猪佩奇只差这一袋金币，帮我领取', "狂撒金币，最高可兑换iPhone X，快来试试！"];
const shareMoregameImage = ['http://static.bjpengkai.cn/gamePK/shareImage/5.jpg','http://static.bjpengkai.cn/gamePK/shareImage/1.jpg']
const signNum = [18, 58, 188, 288, 388, 588, 1088];

const config = {
    signNum,
    host,
    shareArray,
    shareTiaozhan,
    shareMoregame,
    shareArrayImage,
    shareTiaozhanImage,
    shareMoregameImage,
    getGame: host + 'api/v1/getGame', //每日推荐游戏 openid key
    getuser: host + 'api/v1/wx/openid', //获取用户openid
    Md5key: Md5key,
    rank: host + 'api/v1/rank',//所有游戏 id key openid n
    personalrank: host + "api/v1/personalrank",//获取个人排名    openid key id
    setPerple: host + "api/v1/setPerple",//
    formId: host + "api/v1/formId",// 获取formId
    peopleNum: host + "api/v1/peopleNUm",//更新游戏人数 
    getGameAll: host + "api/v1/getGameAll", // 获得所有游戏 openid  key
    integral: host + "api/v1/integral",//加积分
    getuserJF: host + "api/v1/wx/userGold",//获取积分
    serUser: host + "api/v1/wx/user", //更新用户信息
    choiceGame: host + "api/v1/choiceGame", //乐园精选游戏
    getSignIn: host + "api/v1/getSignIn", //获取签到状态
    signIn: host + "api/v1/signIn",//签到
    addGold: host + "api/v1/addGold",//添加金币
    detail: host + "api/v1/detail",//明细【
    goods: host + "api/v1/goods",//获取商品信息表 
    getDetail: host + "api/v1/getDetail",//获取明细
    getData: host + "api/v1/data",//获取个人中心信息
    getTask: host + "api/v1/getTask",//任务
    updTask: host + "api/v1/updTask",//更新任务状态
    record: host + "api/v1/record",//战绩榜
    gameNum: host + "api/v1/gameNum",//
    othersGame: host + "api/v1/othersGame",//商务合作
    exchange: host  + "api/v1/exchange",
    //setScore html5 openid key id
};

module.exports = config
