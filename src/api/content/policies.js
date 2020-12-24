import request from '@/router/axios';

export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/policy/list',
    method: 'get',
    params: {
      ...params,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export const add = (row) => {
  return request({
    url: '/policy/add',
    method: 'post',
    data: row
  })
}


export const getDetail = (id) => {
  return request({
    url: `/policy/get/${id}`,
    method: 'get'
  })
}

export const remove = (id) => {
  return request({
    url: `/policy/delete/${id}`,
    method: 'get'
  })
}

export const update = (row) => {
  return request({
    url: '/policy/update',
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
