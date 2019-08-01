import request from '@/utils/request'

export default {
    //根据视频id获取视频播放凭证
    getPlayAuthVideo(vid) {
        return request({
            url:`/eduvod/vid/getPlayAuth/${vid}`,
            method:'get'
        })
    }
}