import request from '@/utils/request'

const apiname = '/edustastics/countData'

export default {
  // 根据日期获取统计数据 添加统计分析表
  createData(day) {
    return request({
      url: `${apiname}/createData/${day}`,
      method: 'get'
    })
  },
  // 根据日期范围查询统计数据
  getDataByDate(searchObj) {
    return request({
      url: `${apiname}/showCharts/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: 'get'
    })
  }
}

