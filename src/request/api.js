import api from './http'

// 加载车站信息
const getStations = params => api.get('/max/getStations', params);

// 查询车票信息
const getTickets = params => api.get('/max/queryTicketInfo', params);

// 查询车票价格
const getTicketPrice = params => api.get('/max/queryTicketPrice', params);

// 获取图片验证码
const getImgCapthcha = params => api.get('/max/getImgCapthcha', params);

// 校验图片验证码
const checkCapthcha = params => api.get('/max/checkImgCapthcha', params);

// 初始化滑块验证
const initSlidePassport = params => api.post('/max/initSlidePassport', params);

// 用户登录
const userLogin = params => api.post('/max/userLogin', params);

// 用户认证
const userPassPortUamtk = params => api.post('/max/passPortUamtk', params);

// 获取用户名
const getUserName=params=>api.get('/max/getUserName',params);

// 用户退出
const userLoginOut=params=>api.get('/max/userLoginOut',params);

// 获取乘车人信息
const getPassengers=params=>api.get('/max/getPassengers',params);

// 删除乘车人
const delPassengers=params=>api.post('/max/delPassenger',params);

// 新增乘车人
const addPassengers=params=>api.post('/max/addPassenger',params);

// 获取订单信息
const getOrderInfo=params=>api.get('/max/getOrderInfo',params);

// 获取未完成订单信息
const getNoCompleteOrder=params=>api.get('/max/getOrderNoComplete',params);

// 滑块验证 -> 检查订单 -> 确认订单
const checkSlidePassCodeForOrder=params=>api.post('/max/checkSlidePassCodeForOrder',params);

// 提交订单
const submitOrderRequest=params=>api.post('/max/submitOrder',params);

// 获取可用cdn数量
const getCdnCount=params=>api.get('/max/getCdnCount',params);

export default {
    getStations,
    getTickets,
    getTicketPrice,
    getImgCapthcha,
    checkCapthcha,
    initSlidePassport,
    userLogin,
    userPassPortUamtk,
    getUserName,
    userLoginOut,
    getPassengers,
    delPassengers,
    getOrderInfo,
    addPassengers,
    getNoCompleteOrder,
    checkSlidePassCodeForOrder,
    submitOrderRequest,
    getCdnCount
}