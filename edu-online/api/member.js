import request from '@/utils/request'

export default {
    //根据token值获取用户信息
    getUserInfoToken(token) {
        return request({
            url:`/educenter/member/${token}`,
            method:'get'
        })
    }
}