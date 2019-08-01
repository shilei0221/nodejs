import request from '@/utils/request'

export default {
    //讲师分页列表的方法
    getTeacherListPage(page, limit) {
        return request({
            url:`/eduservice/frontteacher/listTeacherFront/${page}/${limit}`,
            method:'get'
        })
    },
    // 跟据讲师 id 查询信息
    getTeacherInfo(id) {
        return request({
            url :`/eduservice/frontteacher/getTeacherInfoCourse/${id}`,
            method:'get'
        })
    }
}