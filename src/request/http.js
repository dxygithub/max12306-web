import axios from 'axios';
import QS from 'qs';
import Msg from "../assets/js/common";

// 请求超时时间
axios.defaults.timeout = 100000;

// 默认请求地址
axios.defaults.baseURL = '/api';

// 跨域设置cookie
axios.defaults.withCredentials = true;

// 默认请求头设置
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// 请求拦截器
// axios.interceptors.request.use(
//     config => {
//         // 设置请求头token
//         const token = localStorage.getItem('token');
//         token && (config.headers.Authorization = token);
//         return config;
//     },
//     error => {
//         return Promise.error(error);
//     }
// )

// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        }else {
            return Promise.reject(response);
        }
    }
)

// get
function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res);
            return res;
        }).catch(err => {
            reject(err);
        })
    })
}

// post
function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, JSON.stringify(params))
            .then(res => {
                resolve(res);
                return res;
            }).catch(err => {
                reject(err);
            })
    })
}

export default{
    get,
    post
}

