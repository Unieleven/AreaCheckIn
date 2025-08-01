'use strict';

import axios from 'axios';
import { message } from 'ant-design-vue';
import { showSuccessToast, showFailToast } from "vant";
import router from '@/router';
import store from '@/store';

const http = axios.create({
    // produrction
    baseURL :'https://hislicon-connect-admin.issmart.com.cn/isite',

    // Dev
    // baseURL : 'https://hislicon-connect-admin-dev.issmart.com.cn/isite',

    // header:{
    //     token:localStorage.getItem('token')
    // }
});

// 添加请求拦截器
http.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('token');

        token && (config.headers.token = token);

        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
http.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        // console.log(response);
        const res = response.data;
        if(response.data.code==400){
            showFailToast(response.data.message)
        }
        return res
        // if (res.code == 200 || res.code == 0 || res.meta.code == '1'||res.code==400||res.code==401) {
        //     return res
        // } else {
        //     // (res.code == 401)
        //     message.info(res.meta.message)
        //     // return res
        // }
    },
    error => {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default http;
