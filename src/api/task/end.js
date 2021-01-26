/* TODO 申报结束 */
import request from '@/router/axios';


export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/review-task/list',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize,
      processState: 3
    }
  })
}

export const endTask = row => {
  return request({
    url: '/review-task/confirm/update',
    method: 'POST',
    data: row
  })
}


export const update = (row) => {
  return request({
    url: '/review-task/update',
    method: 'post',
    data: row
  })
}

// 获取评审任务
export const getTask = id => {
  return request({
    url:`/review-task/get/${id}`,
    method: 'get'
  })
}

// 获取分工组
export const getLabor = (rtId) => {
  return request({
    url: `/work-group/list/${rtId}`,
    method: 'get',
  })
}
