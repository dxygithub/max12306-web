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

export default {
    getStations,
    getTickets,
    getTicketPrice,
    getImgCapthcha,
    checkCapthcha,
    initSlidePassport,
    userLogin,
    userPassPortUamtk
}