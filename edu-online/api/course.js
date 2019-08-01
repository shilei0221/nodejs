import request from '@/utils/request'

export default {
    //讲师分页列表的方法
    getCourseListPage(page, limit) {
        return request({
            url:`/eduservice/frontcourse/getCoursePage/${page}/${limit}`,
            method:'get'
        })
    },
    // 跟据课程 id 查询信息
    getCourseInfo(id) {
        return request({
            url :`/eduservice/frontcourse/getCourseInfo/${id}`,
            method:'get'
        })
    }
}