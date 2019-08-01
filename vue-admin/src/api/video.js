import request from '@/utils/request'

export default {
  // 添加小节
  saveChapter(video) {
    return request({
      url: '/eduservice/video/saveVideo',
      method: 'post',
      data: video
    })
  },
  // 根据小节id查询小节信息
  getVideoInfo(id) {
    return request({
      url: '/eduservice/video/' + id,
      method: 'get'
    })
  },
  // 修改小节
  updateVideoInfo(video) {
    return request({
      url: '/eduservice/video/updateVideo',
      method: 'post',
      data: video
    })
  },
  // 删除章节
  removeById(id) {
    return request({
      url: '/eduservice/video/' + id,
      method: 'delete'
    })
  },
  // 删除阿里云视频
  removeAliyunVideo(videoId) {
    return request({
      url: '/eduvod/vid/' + videoId,
      method: 'delete'
    })
  }
}

