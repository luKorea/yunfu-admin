import request from '@/router/axios';

export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/review-init/list',
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
    url: `/review-init/add`,
    method: 'post',
    data: row
  })
}

export const remove = (id) => {
  return request({
    url: `/review-init/delete/${id}`,
    method: 'get'
  })
}

export const update = (row) => {
  return request({
    url: `/review-init/update/${row.createdBy}`,
    method: 'post',
    data: row
  })
}

