import request from '@/router/axios';

export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/column/list',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export const add = (row) => {
  return request({
    url: '/column/add',
    method: 'post',
    data: row
  })
}

export const remove = (id) => {
  return request({
    url: `/column/delete/?id=${id}`,
    method: 'get'
  })
}

export const update = (row) => {
  return request({
    url: '/column/update',
    method: 'post',
    data: row
  })
}


// 更改政策法规上下架
export const updateState = (row) => {
  return request({
    url: '/policy/update/state',
    method: 'get',
    params: {
      ...row
    }
  })
}
