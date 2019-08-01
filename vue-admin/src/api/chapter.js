import request from '@/utils/request'

export default {
  // 根据课程id查询所有章节和小节
  getChapterVideoList(courseId) {
    return request({
      url: '/eduservice/chapter/getAllChapterVideo/' + courseId,
      method: 'get'
    })
  },
  // 添加章节
  saveChapter(chapter) {
    return request({
      url: '/eduservice/chapter/addChapter',
      method: 'post',
      data: chapter
    })
  },
  // 根据章节id查询章节信息
  getChapterInfo(id) {
    return request({
      url: '/eduservice/chapter/' + id,
      method: 'get'
    })
  },
  // 修改章节
  updateChapterInfo(chapter) {
    return request({
      url: '/eduservice/chapter/updateChapter',
      method: 'post',
      data: chapter
    })
  },
  // 删除章节
  removeById(id) {
    return request({
      url: '/eduservice/chapter/' + id,
      method: 'delete'
    })
  }
}

