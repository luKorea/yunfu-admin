/* TODO 申报中 */
import request from '@/router/axios';


export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/review-task/list',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize,
      processState: 1
    }
  })
}

export const getListDetail = (pageNum, pageSize, params, tjId) => {
  return request({
    url: '/review-task/declare/list',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize,
      tjId
    }
  })
}

export const update = (row) => {
  return request({
    url: '/review-task/declare/jury/update',
    method: 'post',
    data: row
  })
}

// 获取评审会列表
export const getJuryList = (row) => {
  return request({
    url: `/review-task/jury/list?tgId=${row.tgId}&tmsId=${row.tmsId}`,
    method: 'get'
  })
}

// 确认接收
export const changeState = row => {
  return request({
    url: '/review-task/declare/update',
    method: 'POST',
    data: row
  })
}
