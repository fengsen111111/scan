// src/api/index.js
import request from '@/utils/request'

//登录
export const login = (data) => {
    return request({
        url: '/food/Store/login',
        method: 'post',
        data,
    })
}
//获取餐位列表 E
export const geSeatList = (data) => {
    return request({
        url: '/food/Seat/geSeatList2',
        method: 'post',
        data,
    })
}
// 结束 C
export const overOrder = (data) => {
    return request({
        url: '/food/Order/overOrder',
        method: 'post',
        data,
    })
}
