import request from '@/router/axios';

export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/review-opinion/list',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

export const add = (row) => {
  return request({
    url: `/review-opinion/add`,
    method: 'post',
    data: row
  })
}

export const remove = (id) => {
  return request({
    url: `/review-opinion/delete/${id}`,
    method: 'get'
  })
}

export const update = (row) => {
  return request({
    url: `/review-opinion/update/${row.createdBy}`,
    method: 'post',
    data: row
  })
}
