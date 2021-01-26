import request from '@/router/axios';

export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/version/list',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export const add = (row) => {
  return request({
    url: '/version/add',
    method: 'post',
    data: row
  })
}

export const remove = (id) => {
  return request({
    url: `/version/delete/?id=${id}`,
    method: 'get'
  })
}

export const update = (row) => {
  return request({
    url: '/version/update',
    method: 'post',
    data: row
  })
}
