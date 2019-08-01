import request from '@/utils/request'

export default {
  // 讲师列表的方法（分页和条件查询）
  getTeacherList(page, limit, teacherQuery) {
    return request({
      url: '/eduservice/teacher/getTeacherPageCondition/' + page + '/' + limit,
      method: 'post',
      data: teacherQuery // data表示通过json数据格式传递数据
    })
  },
  // 删除讲师
  removeTeacherId(id) {
    return request({
      url: '/eduservice/teacher/' + id,
      method: 'delete'
    })
  },
  // 添加讲师
  saveTeacher(teacher) {
    return request({
      url: '/eduservice/teacher/addTeacher',
      method: 'post',
      data: teacher // json传递
    })
  },
  // 根据讲师id查询
  getTeacherById(id) {
    return request({
      url: '/eduservice/teacher/getTeacherInfo/' + id,
      method: 'get'
    })
  },
  // 实现修改操作
  updateTeacherById(teacher) {
    return request({
      url: '/eduservice/teacher/updateTeacher',
      method: 'post',
      data: teacher
    })
  }
}

