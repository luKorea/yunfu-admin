import request from '@/router/axios';

export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/base/talent/select/time/get',
    method: 'get'
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
    url: '/base/talent/select/time/update',
    method: 'post',
    data: row
  })
}
