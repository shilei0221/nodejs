import request from '@/utils/request'

export default {
  // 添加课程信息
  saveCourseInfo(courseInfoForm) {
    return request({
      url: '/eduservice/course/addCourse',
      method: 'post',
      data: courseInfoForm

    })
  },
  // 查询所有的讲师（没有分页）
  getTeacherList() {
    return request({
      url: '/eduservice/teacher',
      method: 'get'
    })
  },
  // 根据课程id查询课程信息
  getCourseInfoId(id) {
    return request({
      url: '/eduservice/course/' + id,
      method: 'get'
    })
  },
  // 修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/course/updateCourse',
      method: 'post',
      data: courseInfo
    })
  },
  // 根据课程id查询课程信息(多张表数据)
  getAllCourseInfo(courseId) {
    return request({
      url: '/eduservice/course/getCourseAllInfo/' + courseId,
      method: 'get'
    })
  },
  // 课程最终发布
  publishCourse(courseId) {
    return request({
      url: '/eduservice/course/publishCourse/' + courseId,
      method: 'post'
    })
  },
  findAllCourseList() {
    return request({
      url: '/eduservice/course/findAllCourse',
      method: 'get'
    })
  },
  // 删除课程方法
  removeCourseById(courseId) {
    return request({
      url: '/eduservice/course/' + courseId,
      method: 'delete'
    })
  }
}

