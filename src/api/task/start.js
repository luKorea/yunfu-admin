/* TODO 评审未开始 */
import request from '@/router/axios';


export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/review-task/list',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize,
      processState: 0
    }
  })
}

export const update = (row) => {
  return request({
    url: '/review-task/update',
    method: 'post',
    data: row
  })
}
