import request from '@/utils/request'

export default {
  // 查询所有分类
  getSubjectList() {
    return request({
      url: '/eduservice/subject/getAllSubject',
      method: 'get'

    })
  },
  // 删除分类
  deleteSubjectId(id) {
    return request({
      url: '/eduservice/subject/' + id,
      method: 'delete'
    })
  },
  // 添加一级分类
  saveOneLevel(subject) {
    return request({
      url: '/eduservice/subject/addLevelOne',
      method: 'post',
      data: subject
    })
  },
  // 添加二级分类
  saveTwoLevel(subject) {
    return request({
      url: '/eduservice/subject/addLevelTwo',
      method: 'post',
      data: subject
    })
  }
}

